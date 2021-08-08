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
                                                [Service] ITransferService transferService)
        {
            return await transferService.TransferStackAsync(stackId, toDeviceId);
        }
        public async Task<Transfer> TransferClip(Guid clipId,
                                                Guid toDeviceId,
                                                [Service] ITransferService transferService)
        {
            return await transferService.TransferClipAsync(clipId, toDeviceId);
        }

        public async Task<List<DownloadToken>> AcceptTransfer(Guid transferId,
                                                [Service] ITransferService transferService,
                                                [Service] IFileNodeService fnService)

        {
            var t = await transferService.UpdateStatusAsync(transferId, TransferStatus.Accepted);
            return await fnService.GetDownloadTokens(t.Stack);
        }
        public async Task<Transfer> DeclineTransfer(Guid transferId,
                                                [Service] ITransferService transferService)

        {
            return await transferService.UpdateStatusAsync(transferId, TransferStatus.Declined);
        }

        public async Task<Transfer> DismissClipTransfer(Guid transferId,
                                                        bool didCopy,
                                                        [Service] ITransferService transferService)

        {
            return await transferService.UpdateStatusAsync(transferId, didCopy ? TransferStatus.Copied : TransferStatus.Dismissed);
        }
    }
}