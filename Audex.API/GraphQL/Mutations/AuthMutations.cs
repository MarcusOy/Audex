using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using System.Threading;
using Audex.API.Services;
using HotChocolate;

namespace Audex.API.GraphQL.Mutations
{
    public class AuthMutations
    {
        public GetTokenResponse Authenticate(string username, string password, string device, [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = identityService.Authenticate(username, password, device);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }

        public GetTokenResponse Reauthenticate(string token, [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = identityService.Reauthenticate(token);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }
    }
    public class GetTokenResponse
    {
        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }
    }

}