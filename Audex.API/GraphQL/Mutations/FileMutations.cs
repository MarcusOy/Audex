using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class FileMutations
    {
        [Authorize]
        [RequestSizeLimit(2000000000)]
        public async Task<string> UploadFile(
            IFile f,
            [Service] ILogger<FileMutations> logger,
            [Service] IFileNodeService fileNodeService)
        {
            var file = f.ToFormFile();
            if (file != null && file.Length > 0)
            {
                var fn = await fileNodeService.CreateAsync(file);

                logger.LogInformation($"File '{file.FileName} uploaded.'");
                return fn.Id.ToString("N");
            }
            logger.LogError($"File '{file.FileName} failed to upload.'");
            throw new InvalidOperationException("Not a file.");
        }

        [Authorize]
        public async Task<List<DownloadToken>> GetDownloadTokens(
            List<Guid> fileIds,
            [Service] IFileNodeService fnService)
        {
            if (fileIds.Count > 0)
            {
                return await fnService.GetDownloadTokens(fileIds);
            }
            throw new InvalidOperationException("No fileIds specified.");
        }

        [Authorize]
        public async Task<List<DownloadToken>> GetDownloadTokensForStack(
            Guid stackId,
            [Service] AudexDBContext context,
            [Service] IIdentityService idService,
            [Service] IFileNodeService fnService)
        {
            var stack = context.Stack
                .Include(s => s.Files)
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == idService.CurrentUser.Id)
                .FirstOrDefault(s => s.Id == stackId);
            if (stack is null)
                throw new InvalidOperationException("Stack not found.");
            return await fnService.GetDownloadTokens(stack);
        }
    }
}