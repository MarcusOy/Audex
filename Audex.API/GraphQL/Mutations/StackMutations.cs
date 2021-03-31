using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using System.Threading;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;
using System;
using HotChocolate.Types;
using Audex.API.Models.Stacks;
using HotChocolate.Subscriptions;
using Audex.API.GraphQL.Subscriptions;
using Audex.API.GraphQL.Extensions;
using Audex.API.Data;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Audex.API.Helpers;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType(Name = "Mutation")]

    public class StackMutations
    {
        [Authorize]
        public async Task<Stack> CreateStartingStack(
            [CurrentUserGlobalState] CurrentUser user,
            [Service] IStackService stackService,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await stackService.CreateStartingStackAsync(user.UserId);

            await eventSender.SendAsync(
                nameof(StackSubscriptions.OnStacksUpdate) + stack.OwnerUserId.ToString(),
                stack.Id
            );

            return stack;
        }

        [Authorize]
        public async Task<string> RenameStack(
            Guid stackId,
            string newName,
            [CurrentUserGlobalState] CurrentUser user,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await dbContext.Stack
                .Where(s => s.OwnerUserId == user.UserId)
                .FirstOrDefaultAsync(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidDataException("Stack not found.");

            stack.Name = SanitizerHelper.SanitizeString(newName);
            await dbContext.SaveChangesAsync();

            await eventSender.SendAsync(
                nameof(StackSubscriptions.OnStacksUpdate) + stack.OwnerUserId.ToString(),
                stack.Id
            );

            return newName;
        }
        [Authorize]
        public async Task<Stack> DeleteStack(
            Guid stackId,
            [CurrentUserGlobalState] CurrentUser user,
            [Service] AudexDBContext dbContext,
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ITopicEventSender eventSender)
        {
            var stack = await dbContext.Stack
                .Where(s => s.OwnerUserId == user.UserId)
                .FirstOrDefaultAsync(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidDataException("Stack not found.");

            dbContext.Stack.Remove(stack);
            await dbContext.SaveChangesAsync();

            await eventSender.SendAsync(
                nameof(StackSubscriptions.OnStacksUpdate) + stack.OwnerUserId.ToString(),
                stack.Id
            );

            return stack;
        }
    }
}