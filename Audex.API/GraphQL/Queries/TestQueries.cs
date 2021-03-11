using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;

namespace Audex.API.GraphQL.Queries
{
    [ExtendObjectType(Name = "Query")]
    public class TestQueries
    {

        public string Heartbeat()
        {
            return "API is online.";
        }

        [Authorize]
        public string TestAuthorized()
        {
            return "You are authorized! Use WhoAmI for more details.";
        }

    }
}