using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Audex.API.Helpers;
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
        public (string AuthToken, string RefreshToken) Authenticate(string username, string password);
        public (string AuthToken, string RefreshToken) Reauthenticate(string refreshToken);
    }

    public class IdentityService : IIdentityService
    {
        private IHttpContextAccessor _context { get; }
        private ILogger<IdentityService> _logger { get; }
        private AudexDBContext _dbContext { get; }
        private AudexSettings _settings { get; }

        public IdentityService(IHttpContextAccessor context,
                               ILogger<IdentityService> logger,
                               AudexDBContext dbContext,
                               IOptions<AudexSettings> settings)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
        }
        public (string AuthToken, string RefreshToken) Authenticate(string username, string password)
        {
            var roles = new List<string>();
            var u = _dbContext.Users
                    .Include(u => u.Group)
                    .Include(u => u.Group.GroupRoles)
                        .ThenInclude(gr => gr.Role)
                    .FirstOrDefault(u => u.Username == username);

            if (u is null || u.Password != SecurityHelpers.GenerateHashedPassword(password, Convert.FromBase64String(u.Salt)))
                throw new AuthenticationException("Credentials not valid.");

            foreach (GroupRole gR in u.Group.GroupRoles)
            {
                roles.Add(gR.Role.Name);
            }

            return (
                GenerateAuthToken(username, u.Id, roles.ToArray()).Token,
                GenerateRefreshToken(u.Id).Token
            );
        }

        public (string AuthToken, string RefreshToken) Reauthenticate(string refreshToken)
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
                    .Where(t => t.IsRefreshToken)
                    .SingleOrDefault(t => t.Token == hash);

            if (t is null || !t.IsActive)
                throw new AuthenticationException("Refresh token not valid.");

            var newToken = GenerateRefreshToken(u.Id);
            t.RevokedOn = DateTime.UtcNow;
            t.RevokedByIP = GetIPAddress();
            t.ReplacedByTokenId = newToken.EntityId;

            foreach (GroupRole gR in u.Group.GroupRoles)
            {
                roles.Add(gR.Role.Name);
            }

            return (
                GenerateAuthToken(u.Username, u.Id, roles.ToArray()).Token,
                newToken.Token
            );

        }

        private (string Token, Guid EntityId) GenerateAuthToken(string username, Guid userId, string[] roles)
        {
            var key = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(_settings.Jwt.Key)); // TODO: change secret to one generated on initialization

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username)
            };

            var expiry = DateTime.UtcNow.AddMinutes(1);

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
            var e = _dbContext.AuthTokens.Add(new AuthToken
            {
                IsRefreshToken = false,
                Token = SecurityHelpers.GenerateHash(signedToken),
                ExpiresOn = expiry,
                CreatedOn = DateTime.UtcNow,
                CreatedByIP = GetIPAddress(),
                UserId = userId
            });
            _dbContext.SaveChanges();

            return (signedToken, e.Entity.Id);
        }
        private (string Token, Guid EntityId) GenerateRefreshToken(Guid userId)
        {
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                var token = Convert.ToBase64String(randomBytes);

                var e = _dbContext.AuthTokens.Add(new AuthToken
                {
                    IsRefreshToken = true,
                    Token = SecurityHelpers.GenerateHash(token),
                    ExpiresOn = DateTime.UtcNow.AddDays(7),
                    CreatedOn = DateTime.UtcNow,
                    CreatedByIP = GetIPAddress(),
                    UserId = userId
                });
                _dbContext.SaveChanges();

                return (token, e.Entity.Id);
            }
        }
        private string GetIPAddress()
        {
            if (_context.HttpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
                return _context.HttpContext.Request.Headers["X-Forwarded-For"];
            else
                return _context.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}