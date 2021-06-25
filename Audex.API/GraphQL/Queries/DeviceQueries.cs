using System;
using System.Linq;
using Audex.API.Data;
using Audex.API.GraphQL.Extensions;
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
    public class DeviceQueries
    {
        [Authorize, UsePaging, UseFiltering, UseSorting]
        public IQueryable<DeviceType> GetDeviceTypes([Service] AudexDBContext context)
        {
            return context.DeviceTypes
                .Where(dt => dt.Id != DeviceTypeEnum.AudexServer);
        }
    }
}