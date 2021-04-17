using System.Threading.Tasks;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using HotChocolate.Types;
using Audex.API.Models.Stacks;
using HotChocolate.Subscriptions;
using Audex.API.GraphQL.Subscriptions;
using Audex.API.GraphQL.Extensions;
using Audex.API.Data;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Audex.API.Helpers;
using System.Collections.Generic;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]

    public class StackMutations
    {
        [Authorize]
        public async Task<Stack> CreateStartingStack(
            [CurrentUserGlobalState] CurrentUser user,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await stackService.CreateStartingStackAsync(user.UserId);

            await eventSender.SendAsync(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                new Guid[] { stack.Id }
            );

            return stack;
        }

        [Authorize]
        public async Task<Stack> CreateStack(
            List<Guid> fileIds,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await stackService.CreateAsync(fileIds);

            await eventSender.SendAsync(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                new Guid[] { stack.Id }
            );
            return stack;
        }

        [Authorize]
        public async Task<Stack> EnsureInStack(
            Guid stackId,
            List<Guid> fileIds,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await stackService.Ensure(stackId, fileIds);

            await eventSender.SendAsync(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                new Guid[] { stack.Id }
            );
            return stack;
        }

        [Authorize]
        public async Task<string> RenameStack(
            Guid stackId,
            string newName,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await dbContext.Stack
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUser.Username == context.HttpContext.User.Identity.Name)
                .FirstOrDefaultAsync(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidDataException("Stack not found.");

            stack.Name = SanitizerHelper.SanitizeString(newName);
            await dbContext.SaveChangesAsync();

            await eventSender.SendAsync(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                new Guid[] { stack.Id }
            );

            return newName;
        }
        [Authorize]
        public async Task<List<Stack>> DeleteStacks(
            List<Guid> stackIds,
            [CurrentUserGlobalState] CurrentUser user,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor context,
            [Service] ITopicEventSender eventSender)
        {
            var stacks = await dbContext.Stack
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == user.UserId)
                .Where(s => stackIds.Contains(s.Id))
                .ToListAsync();

            if (stacks.Count == 0)
                throw new InvalidDataException("Stack not found.");

            foreach (Stack s in stacks)
                s.DeletedOn = DateTime.UtcNow;

            dbContext.Stack.UpdateRange(stacks); // TODO: integrate into StackService, mark for delete child filenodes
            await dbContext.SaveChangesAsync();

            await eventSender.SendAsync(
                $"{nameof(StackSubscriptions.OnStacksUpdate)}_{context.HttpContext.User.Identity.Name}",
                stacks.Select(s => s.Id).ToArray()
            );

            return stacks;
        }
    }
}