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

    public class ClipMutations
    {
        [Authorize]
        public async Task<Clip> CreateStartingClip(
            [Service] IIdentityService identityService,
            [Service] IClipService clipService,
            [Service] IHttpContextAccessor context,
            [Service] ISubscriptionService subService)
        {
            var clip = await clipService.CreateStartingClipAsync(identityService.CurrentUser.Id);

            await subService.NotifyAsync(SubscriptionTopic.OnClipsUpdate, new Guid[] { clip.Id });

            return clip;
        }

        [Authorize]
        public async Task<Clip> CreateClip(
            string content,
            bool isSecure,
            [Service] IClipService clipService,
            [Service] ISubscriptionService subService)
        {
            var clip = await clipService.CreateAsync(content, isSecure);

            await subService.NotifyAsync(SubscriptionTopic.OnClipsUpdate, new Guid[] { clip.Id });

            return clip;
        }

        [Authorize]
        public async Task<string> EditClip(
            Guid clipId,
            string newContent,
            [Service] AudexDBContext dbContext,
            [Service] IIdentityService idService,
            [Service] ISubscriptionService subService)
        {
            var clip = await dbContext.Clips
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUser.Id == idService.CurrentUser.Id)
                .FirstOrDefaultAsync(s => s.Id == clipId);

            if (clip is null)
                throw new InvalidDataException("Clip not found.");

            if (String.IsNullOrWhiteSpace(newContent))
                clip.Content = null;
            else
                clip.Content = newContent;

            await dbContext.SaveChangesAsync();
            await subService.NotifyAsync(SubscriptionTopic.OnClipsUpdate, new Guid[] { clip.Id });

            return newContent;
        }
        [Authorize]
        public async Task<List<Clip>> DeleteClips(
            List<Guid> clipIds,
            [Service] IIdentityService idService,
            [Service] AudexDBContext dbContext,
            [Service] ISubscriptionService subService)
        {
            var clips = await dbContext.Clips
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == idService.CurrentUser.Id)
                .Where(s => clipIds.Contains(s.Id))
                .ToListAsync();

            if (clips.Count == 0)
                throw new InvalidDataException("Clip not found.");

            foreach (Clip c in clips)
                c.DeletedOn = DateTime.UtcNow;

            dbContext.Clips.UpdateRange(clips);
            await dbContext.SaveChangesAsync();

            await subService.NotifyAsync(SubscriptionTopic.OnStacksUpdate, clips.Select(s => s.Id).ToArray());

            return clips;
        }
    }
}