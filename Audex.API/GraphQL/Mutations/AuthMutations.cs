using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using System.Threading;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.Types;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class AuthMutations
    {
        public async Task<GetTokenResponse> Authenticate(string username, string password, string device, [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = await identityService.Authenticate(username, password, device);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }

        public async Task<GetTokenResponse> Reauthenticate(string token, [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = await identityService.Reauthenticate(token);
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