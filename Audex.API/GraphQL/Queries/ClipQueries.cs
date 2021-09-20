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
    public class ClipQueries
    {
        [Authorize, UsePaging(DefaultPageSize = 25, MaxPageSize = 50, IncludeTotalCount = true), UseFiltering, UseSorting]
        public IQueryable<Clip> GetClips([Service] IIdentityService identityService,
                                           [Service] AudexDBContext context)
        {
            return context.Clips
                .Where(s => s.OwnerUserId == identityService.CurrentUser.Id)
                .Where(s => s.DeletedOn == null)
                .Include(s => s.OwnerUser)
                .Include(s => s.UploadedByDevice)
                    .ThenInclude(d => d.DeviceType)
                .OrderByDescending(s => s.CreatedOn);
        }
    }
}