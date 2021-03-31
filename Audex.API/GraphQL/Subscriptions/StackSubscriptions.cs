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
using Microsoft.EntityFrameworkCore;

namespace Audex.API.GraphQL.Subscriptions
{
    [ExtendObjectType(Name = "Subscription")]
    public class StackSubscriptions
    {
        [Authorize, Subscribe(With = nameof(SubscribeOnStacksUpdateAsync))]
        public async Task<Stack> OnStacksUpdate(
            [EventMessage] Guid changedStackId,
            [CurrentUserGlobalState] CurrentUser user,
            [Service] AudexDBContext context
        )
        {
            return await context.Stack
                .Where(s => s.OwnerUserId == user.UserId)
                .FirstOrDefaultAsync(s => s.Id == changedStackId);
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid>> SubscribeOnStacksUpdateAsync(
            [CurrentUserGlobalState] CurrentUser user,
            [Service] ITopicEventReceiver eventReceiver,
            CancellationToken cancellationToken
        )
        {
            return await eventReceiver.SubscribeAsync<string, Guid>(
                 nameof(StackSubscriptions.OnStacksUpdate) + user.UserId.ToString(),
                 cancellationToken
            );
        }
    }
}