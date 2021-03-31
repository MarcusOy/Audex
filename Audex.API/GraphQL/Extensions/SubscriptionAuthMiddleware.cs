using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Subscriptions;
using HotChocolate.AspNetCore.Subscriptions.Messages;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;

namespace Audex.API.GraphQL.Extensions
{
    public class SubscriptionAuthMiddleware : ISocketSessionInterceptor
    {
        public async ValueTask OnCloseAsync(
            ISocketConnection connection,
            CancellationToken cancellationToken
        )
        {

        }
        public async ValueTask OnRequestAsync(
            ISocketConnection connection,
            IQueryRequestBuilder requestBuilder,
            CancellationToken cancellationToken
        )
        {

        }

        /* We don't need the above two methods, just this one */
        public async ValueTask<ConnectionStatus> OnConnectAsync(
            ISocketConnection connection,
            InitializeConnectionMessage message,
            CancellationToken cancellationToken
        )
        {
            try
            {
                var jwtHeader = message.Payload["Authorization"] as string;

                if (string.IsNullOrEmpty(jwtHeader) || !jwtHeader.StartsWith("Bearer "))
                    return ConnectionStatus.Reject("Unauthorized");

                var token = jwtHeader.Replace("Bearer ", "");
                var opts = connection.HttpContext.RequestServices.GetRequiredService<JwtBearerOptions>();

                var claims = new JwtBearerBacker(opts).IsJwtValid(token);
                if (claims == null)
                    return ConnectionStatus.Reject("Unauthoized(invalid token)");

                // Grab our User ID
                var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";

                // Add it to our HttpContext
                connection.HttpContext.Items["userId"] = userId;

                // Accept the websocket connection
                return ConnectionStatus.Accept();
            }
            catch (Exception ex)
            {
                // If we catch any exceptions, reject the connection.
                // This is probably not ideal, there is likely a way to return a message
                // but I didn't look that far into it.
                return ConnectionStatus.Reject(ex.Message);
            }
        }
    }

    public class JwtBearerBacker
    {
        public JwtBearerOptions Options { get; private set; }

        public JwtBearerBacker(JwtBearerOptions options)
        {
            this.Options = options;
        }

        public ClaimsPrincipal IsJwtValid(string token)
        {
            List<Exception> validationFailures = null;
            SecurityToken validatedToken;
            foreach (var validator in Options.SecurityTokenValidators)
            {
                // Ensure we can even read the token at all
                if (validator.CanReadToken(token))
                {
                    try
                    {
                        // Try to return a ClaimsPrincipal if we can
                        // Otherwise an exception is thrown, caught and we continue on.
                        return validator
                            .ValidateToken(token, Options.TokenValidationParameters, out validatedToken);
                    }
                    catch (Exception ex)
                    {
                        // If the keys are invalid, refresh config
                        if (Options.RefreshOnIssuerKeyNotFound && Options.ConfigurationManager != null
                            && ex is SecurityTokenSignatureKeyNotFoundException)
                        {
                            Options.ConfigurationManager.RequestRefresh();
                        }

                        // Add to our list of failures. This was from the OG code
                        // Not sure what we need it for.
                        if (validationFailures == null)
                            validationFailures = new List<Exception>(1);

                        validationFailures.Add(ex);
                        continue;
                    }
                }
            }

            // No user could be found
            return null;
        }
    }


}