using System;
using System.IO;
using System.Threading.Tasks;
using Audex.API.Helpers;
using Audex.API.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
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
    }
}