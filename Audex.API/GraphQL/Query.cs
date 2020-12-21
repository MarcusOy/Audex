using System.Collections.Generic;
using System.Linq;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Audex.API.GraphQL
{
    public class Query
    {
        public string Test()
        {
            return "This is a test query. It works!";
        }

        public IQueryable<User> GetUsers([ScopedService] AudexDBContext context)
        {
            return context.Users;
        }

        // [Authorize]
        // public List<string> Authorized([Service] IHttpContextAccessor contextAccessor)
        // {
        //     return contextAccessor.HttpContext.User.Claims.Select(x => $"{x.Type} : {x.Value}").ToList();
        // }

        // [Authorize]
        // public List<string> AuthorizedBetterWay([GlobalState("currentUser")] CurrentUser user)
        // {
        //     return user.Claims;
        // }


        // [Authorize(Roles = new[] {"leader"})]
        // public List<string> AuthorizedLeader([GlobalState("currentUser")] CurrentUser user)
        // {
        //     return user.Claims;
        // }

        // [Authorize(Roles = new[] {"dev"})]
        // public List<string> AuthorizedDev([GlobalState("currentUser")] CurrentUser user)
        // {
        //     return user.Claims;
        // }

        // [Authorize(Policy = "DevDepartment")]
        // public List<string> AuthorizedDevDepartment([GlobalState("currentUser")] CurrentUser user)
        // {
        //     return user.Claims;
        // }
    }
}