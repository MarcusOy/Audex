using System.Linq;
using Audex.API.Data;
using Audex.API.Models;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class StackQueries
    {
        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<Stack> GetStacks([Service] IIdentityService identityService,
                                           [Service] AudexDBContext context)
        {
            return context.Stack
                .Where(s => s.OwnerUserId == identityService.CurrentUser.Id)
                .Where(s => s.DeletedOn == null)
                .Include(s => s.StackCategory)
                .Include(s => s.OwnerUser)
                .Include(s => s.UploadedByDevice)
                .Include(s => s.Files)
                .OrderByDescending(s => s.CreatedOn);
        }
    }
}