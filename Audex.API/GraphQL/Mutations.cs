using System.Threading.Tasks;
using Audex.API.Services;
using HotChocolate;

namespace Audex.API.GraphQL
{
    public class Mutation
    {
        public Task<string> GetToken(string username, string password, [Service] IIdentityService identityService) =>
            identityService.Authenticate(username, password);
    }
}