using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.GraphQL.Extensions;
using Audex.API.Models.Stacks;
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
    [ExtendObjectType(Name = "Subscription")]
    public class StackSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnStacksUpdateAsync)), Topic]
        public async Task<Stack> OnStacksUpdate(
            [EventMessage] Guid changedStackId,
            [Service] IHttpContextAccessor context,
            [Service] AudexDBContext dbContext
        )
        {
            return await dbContext.Stack
                .Where(s => s.OwnerUser.Username == context.HttpContext.User.Identity.Name)
                .FirstOrDefaultAsync(s => s.Id == changedStackId);
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid>> SubscribeOnStacksUpdateAsync(
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventReceiver eventReceiver,
            CancellationToken cancellationToken
        )
        {
            return await eventReceiver.SubscribeAsync<string, Guid>(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                 cancellationToken
            );
        }
    }
}