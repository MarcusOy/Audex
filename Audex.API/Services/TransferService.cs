using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Audex.API.Services
{
    public interface ITransferService
    {
        Task<Transfer> TransferStackAsync(Guid stackId, Guid toDeviceId);
        Task<Transfer> TransferClipAsync(Guid clipId, Guid toDeviceId);
        Task<Transfer> UpdateStatusAsync(Guid transferId, TransferStatus status);

    }

    public class TransferService : ITransferService
    {
        private readonly ILogger<TransferService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly IFileNodeService _settings;
        private readonly IIdentityService _idService;
        private readonly ISubscriptionService _subService;
        private readonly INotificationService _notificationService;

        public TransferService(ILogger<TransferService> logger,
                               AudexDBContext dbContext,
                               IFileNodeService settings,
                               IIdentityService idService,
                               ISubscriptionService subService,
                               INotificationService notificationService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings;
            _idService = idService;
            _subService = subService;
            _notificationService = notificationService;
        }

        public async Task<Transfer> TransferStackAsync(Guid stackId, Guid toDeviceId)
        {
            var transfer = await MakeTransfer(toDeviceId, stackId: stackId);
            if (!String.IsNullOrWhiteSpace(transfer.ToDevice.NotificationIdentifier))
                await _notificationService.SendNotification(
                    new TransferStackNotification(_idService.CurrentDevice, transfer.ToDevice, transfer.Stack)
                );

            return transfer;
        }
        public async Task<Transfer> TransferClipAsync(Guid clipId, Guid toDeviceId)
        {
            var transfer = await MakeTransfer(toDeviceId, clipId: clipId);
            if (!String.IsNullOrWhiteSpace(transfer.ToDevice.NotificationIdentifier))
                await _notificationService.SendNotification(
                    new TransferClipNotification(_idService.CurrentDevice, transfer.ToDevice, transfer.Clip)
                );

            return transfer;
        }
        public async Task<Transfer> UpdateStatusAsync(Guid transferId, TransferStatus status)
        {
            var t = _dbContext.Transfers
                .Include(t => t.Stack)
                    .ThenInclude(s => s.Files)
                .Where(t => t.ToUserId == _idService.CurrentUser.Id)
                .Where(t => t.Status == TransferStatus.Pending)
                .FirstOrDefault(t => t.Id == transferId);

            if (t == null)
                throw new InvalidOperationException("Invalid transfer.");

            t.Status = status;

            _dbContext.Transfers.Update(t);
            await _dbContext.SaveChangesAsync();
            await _subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, _idService.CurrentUser.Id);

            return t;
        }

        private async Task<Transfer> MakeTransfer(Guid toDeviceId, Guid? stackId = null, Guid? clipId = null)
        {
            if (stackId is null && clipId is null || stackId is not null && clipId is not null)
                throw new InvalidOperationException("Transfers must have ONLY a stack or a clip.");

            var d = _dbContext.Devices
                .FirstOrDefault(d => d.Id == toDeviceId
                    && d.UserId == _idService.CurrentUser.Id);

            if (d == null)
                throw new InvalidOperationException("Invalid device.");

            var transfer = new Transfer
            {
                Status = TransferStatus.Pending,
                FromUserId = _idService.CurrentUser.Id,
                FromDeviceId = _idService.CurrentDevice.Id,
                ToUserId = _idService.CurrentUser.Id,
                ToDeviceId = d.Id
            };

            if (stackId is not null)
            {
                var s = _dbContext.Stacks
                    .Include(s => s.Files)
                    .Where(s => s.OwnerUserId == _idService.CurrentUser.Id)
                    .FirstOrDefault(s => s.Id == stackId);

                if (s == null)
                    throw new InvalidOperationException("Invalid stack.");

                transfer.StackId = s.Id;
            }

            if (clipId is not null)
            {
                var c = _dbContext.Clips
                    .Where(c => c.OwnerUserId == _idService.CurrentUser.Id)
                    .FirstOrDefault(c => c.Id == clipId);

                if (c == null)
                    throw new InvalidOperationException("Invalid clip.");

                transfer.ClipId = c.Id;
            }

            await _dbContext.Transfers.AddAsync(transfer);
            await _dbContext.SaveChangesAsync();
            await _subService.NotifyAsync(SubscriptionTopic.OnUserUpdate, _idService.CurrentUser.Id);

            return transfer;
        }
    }
}