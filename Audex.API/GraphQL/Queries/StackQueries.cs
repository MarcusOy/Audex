using System.Linq;
using Audex.API.Data;
using Audex.API.GraphQL.Extensions;
using Audex.API.Models.Stacks;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.GraphQL.Queries
{
    [ExtendObjectType(Name = "Query")]
    public class StackQueries
    {
        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<Stack> GetStacks([CurrentUserGlobalState] CurrentUser user,
                                            [Service] AudexDBContext context)
        {
            return context.Stack
                .Where(s => s.OwnerUserId == user.UserId)
                .Include(s => s.StackCategory)
                .Include(s => s.OwnerUser)
                .Include(s => s.UploadedByDevice)
                .Include(s => s.Files)
                .OrderByDescending(s => s.CreatedOn);
        }
    }
}