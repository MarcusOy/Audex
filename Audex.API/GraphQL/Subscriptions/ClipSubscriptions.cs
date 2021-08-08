using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.GraphQL.Extensions;
using Audex.API.Models;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.GraphQL.Subscriptions
{
    [ExtendObjectType("Subscription")]
    public class ClipSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnClipsUpdateAsync)), Topic]
        public async Task<List<Stack>> OnClipsUpdate(
            [EventMessage] Guid[] changedClipIds,
            [Service] IIdentityService idService,
            [Service] AudexDBContext dbContext
        )
        {
            return await dbContext.Stacks
                .Where(s => s.OwnerUser.Id == idService.CurrentUser.Id)
                .Where(s => changedClipIds.Contains(s.Id))
                .ToListAsync();
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid[]>> SubscribeOnClipsUpdateAsync(
            [Service] ISubscriptionService subService,
            CancellationToken cancellationToken
        )
        {
            return await subService.SubscribeAsync<Guid[]>(SubscriptionTopic.OnClipsUpdate, cancellationToken);
        }
    }
}