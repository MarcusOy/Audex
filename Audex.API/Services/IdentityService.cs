using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Audex.API.Services
{
    public interface IIdentityService
    {
        string Authenticate(string username, string password);
        public string GenerateRandomPassword(int length, string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_");
        public (byte[] AsBytes, string AsString) GenerateSalt();
        public string GenerateHashedPassword(string password, byte[] salt);
    }

    public class IdentityService : IIdentityService
    {
        private ILogger<IdentityService> _logger { get; }
        private AudexDBContext _context { get; }
        private AudexSettings _settings { get; }

        public IdentityService(ILogger<IdentityService> logger,
                               AudexDBContext context,
                               IOptions<AudexSettings> settings)
        {
            _logger = logger;
            _context = context;
            _settings = settings.Value;
        }
        public string Authenticate(string username, string password)
        {
            //Your custom logic here (e.g. database query)
            //Mocked for a sake of simplicity
            var roles = new List<string>();
            var u = _context.Users
                    .Include(u => u.Group)
                    .Include(u => u.Group.GroupRoles)
                        .ThenInclude(gr => gr.Role)
                    .FirstOrDefault(u => u.Username == username);
            if (u != null)
            {
                if (GenerateHashedPassword(password, Convert.FromBase64String(u.Salt)) == u.Password)
                {
                    foreach (GroupRole gR in u.Group.GroupRoles)
                    {
                        roles.Add(gR.Role.Name);
                    }

                    return GenerateAccessToken(username, u.Id.ToString(), roles.ToArray());
                }
            }

            throw new AuthenticationException("Credential not valid.");
        }

        private string GenerateAccessToken(string username, string userId, string[] roles)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Jwt.Key)); // TODO: change secret to one generated on initialization

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, username)
            };

            claims = claims.Concat(roles.Select(role => new Claim(ClaimTypes.Role, role))).ToList();


            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _settings.Jwt.Issuer, // TODO: Switch to dynamic issuer url
                _settings.Jwt.Audience, // TODO: Should be the same as above
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRandomPassword(int length, string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_")
        {
            using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
            {
                byte[] data = new byte[length];

                // If chars.Length isn't a power of 2 then there is a bias if we simply use the modulus operator. The first characters of chars will be more probable than the last ones.
                // buffer used if we encounter an unusable random byte. We will regenerate it in this buffer
                byte[] buffer = null;

                // Maximum random number that can be used without introducing a bias
                int maxRandom = byte.MaxValue - ((byte.MaxValue + 1) % chars.Length);

                crypto.GetBytes(data);

                char[] result = new char[length];

                for (int i = 0; i < length; i++)
                {
                    byte value = data[i];

                    while (value > maxRandom)
                    {
                        if (buffer == null)
                        {
                            buffer = new byte[1];
                        }

                        crypto.GetBytes(buffer);
                        value = buffer[0];
                    }

                    result[i] = chars[value % chars.Length];
                }

                return new string(result);
            }
        }

        public (byte[] AsBytes, string AsString) GenerateSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            return (salt, Convert.ToBase64String(salt));
        }
        public string GenerateHashedPassword(string password, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }
    }
}