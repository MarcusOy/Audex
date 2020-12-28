using System.Net;
using System.Collections.Generic;
using System.Linq;
using Audex.API.GraphQL.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using HotChocolate.AspNetCore.Authorization;

namespace Audex.API.GraphQL
{
    public class Query
    {

        public string Test()
        {
            return "This is a test query. It works!";
        }

        [Authorize]
        public string TestAuthorized()
        {
            return "This is a test query. You are authorized!";
        }

        [Authorize]
        public User WhoAmI([CurrentUserGlobalState] CurrentUser user,
                           [Service] AudexDBContext context)
        {
            return context.Users
                          .FirstOrDefault(u => u.Id == user.UserId);
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<User> GetUsers([Service] AudexDBContext context)
        {
            return context.Users
                          .Include(u => u.Group)
                          .ThenInclude(g => g.GroupRoles)
                          .ThenInclude(gr => gr.Role);
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<Group> GetGroups([Service] AudexDBContext context)
        {
            return context.Groups
                          .Include(g => g.Users)
                          .Include(g => g.GroupRoles);
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<GroupRole> GetGroupRoles([Service] AudexDBContext context)
        {
            return context.GroupRoles
                          .Include(gr => gr.Group)
                          .Include(gr => gr.Role);
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