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
    public class UserSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnUserUpdateAsync)), Topic]
        public User OnUserUpdate(
            [EventMessage] Guid userId,
            [Service] IIdentityService identityService,
            [Service] AudexDBContext dbContext
        )
        {
            return identityService.CurrentUser;
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid>> SubscribeOnUserUpdateAsync(
            [Service] ISubscriptionService subService,
            CancellationToken cancellationToken
        )
        {
            return await subService.SubscribeAsync<Guid>(SubscriptionTopic.OnUserUpdate, cancellationToken);
        }
    }
}