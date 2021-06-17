using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Audex.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class FileMutations
    {
        [Authorize]
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
            [Service] IHttpContextAccessor httpContext,
            [Service] IFileNodeService fnService)
        {
            var userid = new Guid(httpContext.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var stack = context.Stack
                .Include(s => s.Files)
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == userid)
                .FirstOrDefault(s => s.Id == stackId);
            if (stack is null)
                throw new InvalidOperationException("Stack not found.");

            var fileIds = stack.Files.Select(s => s.Id).ToList();
            if (fileIds.Count > 0)
                return await fnService.GetDownloadTokens(fileIds);
            throw new InvalidOperationException("No files in stack.");
        }
    }
}