using System;
using System.Collections.Specialized;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using System.Web;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OtpNet;
using QRCoder;

namespace Audex.API.Services
{
    public interface ITwoFactorService
    {
        Task<bool> ResolveChallengeAsync(User user, string code);
        QRCodeData GetAuthQR(User user);
        string AuthQRToBase64(User data);
        void AuthQRToTerminal(User data);
        void ResetTwoFactorAsync(User user);
    }
    public class TotpTwoFactorService : ITwoFactorService
    {
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        private readonly ILogger<TotpTwoFactorService> _logger;
        private readonly HttpContext _context;

        public TotpTwoFactorService(AudexDBContext dbContext,
                                    IOptions<AudexSettings> settings,
                                    ILogger<TotpTwoFactorService> logger,
                                    IHttpContextAccessor context)
        {
            _dbContext = dbContext;
            _settings = settings.Value;
            _logger = logger;
            _context = context.HttpContext;
        }

        public async Task<bool> ResolveChallengeAsync(User user, string code)
        {
            // If for some reason the user does not have a two factor key
            if (user.TwoFactorKey is null)
                throw new InvalidOperationException("User does not have two factor key.");

            // If code was not used already
            if (_dbContext.AuthTokens.Where(t => t.Token == code).Count() <= 0)
            {
                if (new Totp(Base32Encoding.ToBytes(user.TwoFactorKey))
                    .VerifyTotp(code, out long timeStep))
                {
                    _dbContext.AuthTokens.Add(new AuthToken
                    {
                        Type = AuthTokenType.TwoFactor,
                        Token = code,
                        ExpiresOn = DateTime.UtcNow.AddMinutes(1),
                        CreatedByIP = _context.GetIPAddress(),
                        UserId = user.Id
                    });
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            throw new AuthenticationException("Code already used.");
        }
        public QRCodeData GetAuthQR(User user)
        {
            if (user.TwoFactorKey is null)
                throw new InvalidOperationException("User does not have two factor key.");

            string baseUri = "otpauth://totp/";
            var query = new NameValueCollection {
                {"issuer", $"{_settings.DisplayName} - {_settings.DomainName}"},
                {"secret", user.TwoFactorKey}
            };
            string authUri = $"{baseUri}{user.Username}{GenerateQueryString(query)}";

            return new QRCodeGenerator().CreateQrCode(authUri, QRCodeGenerator.ECCLevel.Q);
        }
        public string AuthQRToBase64(User user)
        {
            var data = GetAuthQR(user);
            return new Base64QRCode(data).GetGraphic(20);
        }
        public void AuthQRToTerminal(User user)
        {
            var data = GetAuthQR(user);
            _logger.LogInformation($@"
Use the following QR code for 2FA:
{new AsciiQRCode(data).GetGraphic(1, "██", "  ", "\n")}
You can scan this QR code in apps such as Google Authenticator."
            );
        }
        public void ResetTwoFactorAsync(User user)
        {
            var secret = KeyGeneration.GenerateRandomKey(20);
            user.TwoFactorKey = Base32Encoding.ToString(secret);
        }
        private string GenerateQueryString(NameValueCollection collection)
        {
            var querystring = (
                from key in collection.AllKeys
                from value in collection.GetValues(key)
                select string.Format("{0}={1}",
                    key,
                    value)
            ).ToArray();
            return "?" + string.Join("&", querystring);
        }
    }
}