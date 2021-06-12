using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models.Auth;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Audex.API.Services
{
    public interface IIdentityService
    {
        Task<(string AuthToken, string RefreshToken)> Authenticate(string username, string password, string deviceId, string code);
        Task<(string AuthToken, string RefreshToken)> Reauthenticate(string refreshToken);
        User CurrentUser { get; }
        Device CurrentDevice { get; }
    }

    public class IdentityService : IIdentityService
    {
        private readonly HttpContext _context;
        private readonly ILogger<IdentityService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        private readonly ITwoFactorService _twoFactorService;

        public IdentityService(IHttpContextAccessor context,
                               ILogger<IdentityService> logger,
                               AudexDBContext dbContext,
                               IOptions<AudexSettings> settings,
                               ITwoFactorService twoFactorService)
        {
            _context = context.HttpContext;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _twoFactorService = twoFactorService;
        }
        public async Task<(string AuthToken, string RefreshToken)> Authenticate(string username, string password, string deviceId, string code)
        {
            var roles = new List<string>();
            var u = _dbContext.Users
                    .Include(u => u.Group)
                    .Include(u => u.Group.GroupRoles)
                        .ThenInclude(gr => gr.Role)
                    .Include(u => u.Devices)
                    .FirstOrDefault(u => u.Username == username);
            var d = u.Devices.Where(d => d.UserId == u.Id)
                .FirstOrDefault(d => d.Id == new Guid(deviceId));

            if (u is null || u.Password != SecurityHelpers.GenerateHashedPassword(password, Convert.FromBase64String(u.Salt)))
                throw new AuthenticationException("Credentials not valid.");

            if (!Guid.TryParse(deviceId, out _))
                throw new AuthenticationException("DeviceId is not in the correct format.");

            if (d is null)
            {
                if (code is null || code == String.Empty)
                    throw new AuthenticationException("Please verify your new device by providing a two factor code. (2FA_CHALLENGE)");

                if (await _twoFactorService.ResolveChallengeAsync(u, code))
                {
                    d = new Device
                    {
                        Id = new Guid(deviceId),
                        UserId = u.Id,
                        Name = "New device",
                        DeviceType = _dbContext.DeviceTypes
                            .FirstOrDefault(t => t.Name == "Other")
                    };
                    _dbContext.Devices.Add(d);
                    await _dbContext.SaveChangesAsync();
                }
                throw new AuthenticationException("Invalid two factor code.");
            }

            foreach (GroupRole gR in u.Group.GroupRoles)
            {
                roles.Add(gR.Role.Name);
            }

            var newAuthToken = await GenerateAuthToken(u, d, roles.ToArray());
            var newRefreshToken = await GenerateRefreshToken(u, d);

            return (
                newAuthToken.Token,
                newRefreshToken.Token
            );
        }

        public async Task<(string AuthToken, string RefreshToken)> Reauthenticate(string refreshToken)
        {
            var roles = new List<string>();
            var hash = SecurityHelpers.GenerateHash(refreshToken);
            var u = _dbContext.Users
                    .Include(u => u.Group)
                    .Include(u => u.Group.GroupRoles)
                        .ThenInclude(gr => gr.Role)
                    .Include(u => u.Tokens)
                    .SingleOrDefault(u => u.Tokens
                        .Any(t => t.Token == hash)
                    );

            if (u is null)
                throw new AuthenticationException("Credential not valid.");

            var t = u.Tokens
                    .Where(t => t.Type == "Refresh")
                    .SingleOrDefault(t => t.Token == hash);

            if (t is null || !t.IsActive)
                throw new AuthenticationException("Refresh token not valid.");

            var newAuthToken = await GenerateAuthToken(u, t.Device, roles.ToArray());
            var newRefreshToken = await GenerateRefreshToken(u, t.Device);
            t.RevokedOn = DateTime.UtcNow;
            t.RevokedByIP = _context.GetIPAddress();
            t.ReplacedByTokenId = newRefreshToken.EntityId;

            foreach (GroupRole gR in u.Group.GroupRoles)
            {
                roles.Add(gR.Role.Name);
            }

            return (
                newAuthToken.Token,
                newRefreshToken.Token
            );
        }

        public User CurrentUser
        {
            get
            {
                var userid = new Guid(_context.User.Claims
                        .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                return _dbContext.Users
                    .FirstOrDefault(u => u.Id == userid);
            }
        }
        public Device CurrentDevice
        {
            get
            {
                var deviceId = new Guid(_context.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId").Value);
                return _dbContext.Devices
                    .Where(u => u.Id == CurrentUser.Id)
                    .FirstOrDefault(d => d.Id == deviceId);
            }
        }

        private async Task<(string Token, Guid EntityId)> GenerateAuthToken(User user, Device device, string[] roles)
        {
            if (user is null)
                throw new ArgumentNullException("Must pass a user to generate an auth token.");
            if (device is null)
                throw new ArgumentNullException("Must pass a device generate an auth token.");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Jwt.Key)); // TODO: change secret to one generated on initialization
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("deviceId", device.Id.ToString())
            };

            var expiry = DateTime.UtcNow.AddSeconds(15); // TODO: change based on environment

            claims = claims.Concat(roles.Select(role => new Claim(ClaimTypes.Role, role))).ToList();

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _settings.Jwt.Issuer, // TODO: Switch to dynamic issuer url
                _settings.Jwt.Audience, // TODO: Should be the same as above
                claims,
                expires: expiry,
                signingCredentials: signingCredentials);

            var signedToken = new JwtSecurityTokenHandler().WriteToken(token);
            var test = SecurityHelpers.GenerateHash(signedToken);
            var e = await _dbContext.AuthTokens.AddAsync(new AuthToken
            {
                Type = AuthTokenType.Auth,
                Token = SecurityHelpers.GenerateHash(signedToken),
                ExpiresOn = expiry,
                CreatedOn = DateTime.UtcNow,
                CreatedByIP = _context.GetIPAddress(),
                User = user,
                Device = device
            });
            await _dbContext.SaveChangesAsync();

            return (signedToken, e.Entity.Id);
        }
        private async Task<(string Token, Guid EntityId)> GenerateRefreshToken(User user, Device device)
        {
            if (user is null)
                throw new ArgumentNullException("Must pass a user to generate a refresh token.");
            if (device is null)
                throw new ArgumentNullException("Must pass a device generate a refresh token.");

            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                var token = Convert.ToBase64String(randomBytes);

                var e = await _dbContext.AuthTokens.AddAsync(new AuthToken
                {
                    Type = AuthTokenType.Refresh,
                    Token = SecurityHelpers.GenerateHash(token),
                    ExpiresOn = DateTime.UtcNow.AddDays(7),
                    CreatedOn = DateTime.UtcNow,
                    CreatedByIP = _context.GetIPAddress(),
                    User = user,
                    Device = device
                });
                await _dbContext.SaveChangesAsync();

                return (token, e.Entity.Id);
            }
        }
    }
}