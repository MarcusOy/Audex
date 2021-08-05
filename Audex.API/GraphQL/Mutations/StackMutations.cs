using System.Threading.Tasks;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using HotChocolate.Types;

using HotChocolate.Subscriptions;
using Audex.API.GraphQL.Subscriptions;
using Audex.API.Data;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Audex.API.Helpers;
using System.Collections.Generic;
using Audex.API.Models;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]

    public class StackMutations
    {
        [Authorize]
        public async Task<Stack> CreateStartingStack(
            [Service] IIdentityService identityService,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var stack = await stackService.CreateStartingStackAsync(identityService.CurrentUser.Id);

            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, new Guid[] { stack.Id });

            return stack;
        }

        [Authorize]
        public async Task<Stack> CreateStack(
            List<Guid> fileIds,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var stack = await stackService.CreateAsync(fileIds);

            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, new Guid[] { stack.Id });

            return stack;
        }

        [Authorize]
        public async Task<Stack> EnsureInStack(
            Guid stackId,
            List<Guid> fileIds,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var stack = await stackService.Ensure(stackId, fileIds);

            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, new Guid[] { stack.Id });

            return stack;
        }

        [Authorize]
        public async Task<string> RenameStack(
            Guid stackId,
            string newName,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var stack = await dbContext.Stack
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUser.Username == context.HttpContext.User.Identity.Name)
                .FirstOrDefaultAsync(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidDataException("Stack not found.");

            if (String.IsNullOrWhiteSpace(SanitizerHelper.SanitizeString(newName)))
                stack.Name = null;
            else
                stack.Name = SanitizerHelper.SanitizeString(newName);

            await dbContext.SaveChangesAsync();
            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, new Guid[] { stack.Id });

            return newName;
        }
        [Authorize]
        public async Task<List<Stack>> DeleteStacks(
            List<Guid> stackIds,
            [Service] IIdentityService identityService,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var stacks = await dbContext.Stack
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == identityService.CurrentUser.Id)
                .Where(s => stackIds.Contains(s.Id))
                .ToListAsync();

            if (stacks.Count == 0)
                throw new InvalidDataException("Stack not found.");

            foreach (Stack s in stacks)
                s.DeletedOn = DateTime.UtcNow;

            dbContext.Stack.UpdateRange(stacks); // TODO: integrate into StackService, mark for delete child filenodes
            await dbContext.SaveChangesAsync();

            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, stacks.Select(s => s.Id).ToArray());

            return stacks;
        }
    }
}