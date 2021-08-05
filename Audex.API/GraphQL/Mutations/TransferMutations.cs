using System;
using System.Threading.Tasks;
using System.Threading;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.Types;
using Audex.API.Models;
using Audex.API.Data;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class TransferMutations
    {
        public async Task<Transfer> TransferStack(Guid stackId,
                                                Guid toDeviceId,
                                                [Service] AudexDBContext dbContext,
                                                [Service] IIdentityService idService,
                                                [Service] ISubscriptionService subService,
                                                [Service] INotificationService notificationService)
        {
            var d = dbContext.Devices
                .FirstOrDefault(d => d.Id == toDeviceId
                    && d.UserId == idService.CurrentUser.Id);
            var s = dbContext.Stack
                .Include(s => s.Files)
                .Where(s => s.OwnerUserId == idService.CurrentUser.Id)
                .FirstOrDefault(s => s.Id == stackId);

            if (d == null)
                throw new InvalidOperationException("Invalid device.");
            if (d == null)
                throw new InvalidOperationException("Invalid stack.");

            var transfer = new Transfer
            {
                Status = TransferStatus.Pending,
                StackId = s.Id,
                FromUserId = idService.CurrentUser.Id,
                FromDeviceId = idService.CurrentDevice.Id,
                ToUserId = idService.CurrentUser.Id,
                ToDeviceId = d.Id
            };

            await dbContext.Transfers.AddAsync(transfer);
            await dbContext.SaveChangesAsync();
            await subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, idService.CurrentUser.Id);
            if (!String.IsNullOrWhiteSpace(d.NotificationIdentifier))
                await notificationService.SendNotification(new TransferStackNotification(idService.CurrentDevice, d, s));

            return transfer;
        }

        public async Task<List<DownloadToken>> AcceptTransfer(Guid transferId,
                                                [Service] AudexDBContext dbContext,
                                                [Service] IFileNodeService fnService,
                                                [Service] IIdentityService idService,
                                                [Service] ISubscriptionService subService)
        {
            var t = dbContext.Transfers
                .Include(t => t.Stack)
                    .ThenInclude(s => s.Files)
                .Where(t => t.ToUserId == idService.CurrentUser.Id)
                .Where(t => t.Status == TransferStatus.Pending)
                .FirstOrDefault(t => t.Id == transferId);

            if (t == null)
                throw new InvalidOperationException("Invalid transfer.");

            t.Status = TransferStatus.Accepted;

            dbContext.Transfers.Update(t);
            await dbContext.SaveChangesAsync();
            await subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, idService.CurrentUser.Id);

            return await fnService.GetDownloadTokens(t.Stack);
        }
        public async Task<Transfer> DeclineTransfer(Guid transferId,
                                                [Service] AudexDBContext dbContext,
                                                [Service] IIdentityService idService,
                                                [Service] ISubscriptionService subService)
        {
            var t = dbContext.Transfers
                .Where(t => t.ToUserId == idService.CurrentUser.Id)
                .Where(t => t.Status == TransferStatus.Pending)
                .FirstOrDefault(t => t.Id == transferId);

            if (t == null)
                throw new InvalidOperationException("Invalid transfer.");

            t.Status = TransferStatus.Declined;

            dbContext.Transfers.Update(t);
            await dbContext.SaveChangesAsync();
            await subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, idService.CurrentUser.Id);

            return t;
        }
    }
}