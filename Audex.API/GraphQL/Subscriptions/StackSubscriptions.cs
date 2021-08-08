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
    public class StackSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnStacksUpdateAsync)), Topic]
        public async Task<List<Stack>> OnStacksUpdate(
            [EventMessage] Guid[] changedStackIds,
            [Service] IHttpContextAccessor context,
            [Service] AudexDBContext dbContext
        )
        {
            return await dbContext.Stacks
                .Where(s => s.OwnerUser.Username == context.HttpContext.User.Identity.Name)
                .Where(s => changedStackIds.Contains(s.Id))
                .ToListAsync();
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid[]>> SubscribeOnStacksUpdateAsync(
            [Service] ISubscriptionService subService,
            CancellationToken cancellationToken
        )
        {
            return await subService.SubscribeAsync<Guid[]>(SubscriptionTopic.OnStacksUpdate, cancellationToken);
        }
    }
}