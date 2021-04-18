using System.Data;
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
using Audex.API.Models.Auth;
using Audex.API.Data;

namespace Audex.API.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class UserQueries
    {
        [Authorize]
        public User WhoAmI([CurrentUserGlobalState] CurrentUser user,
                           [Service] AudexDBContext context)
        {
            return context.Users
                          .Include(u => u.Group)
                            .ThenInclude(g => g.GroupRoles)
                            .ThenInclude(gr => gr.Role)
                          .Select(u => new User
                          {
                              Id = u.Id,
                              Username = u.Username,
                              // Excluding Password and Salt
                              Password = "***",
                              Salt = "***",
                              CreatedOn = u.CreatedOn,
                              Active = u.Active,
                              GroupId = u.GroupId,
                              Group = u.Group,
                              Devices = u.Devices
                          })
                          .OrderBy(u => u.Id)
                          .FirstOrDefault(u => u.Id == user.UserId)
;
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<User> GetUsers([Service] AudexDBContext context)
        {
            return context.Users
                .Include(u => u.Group)
                    .ThenInclude(g => g.GroupRoles)
                    .ThenInclude(gr => gr.Role)
                .Select(u => new User
                {
                    Id = u.Id,
                    Username = u.Username,
                    // Excluding Password and Salt
                    Password = "***",
                    Salt = "***",
                    CreatedOn = u.CreatedOn,
                    Active = u.Active,
                    GroupId = u.GroupId,
                    Group = u.Group,
                    Devices = u.Devices
                })
                .OrderBy(u => u.Id);
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<Group> GetGroups([Service] AudexDBContext context)
        {
            return context.Groups
                .Include(g => g.Users)
                .Include(g => g.GroupRoles)
                .OrderBy(g => g.Id);
            ;
        }

        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<GroupRole> GetGroupRoles([Service] AudexDBContext context)
        {
            return context.GroupRoles
                .Include(gr => gr.Group)
                .Include(gr => gr.Role)
                .OrderBy(g => g.Id);
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