// using System;
// using System.Threading.Tasks;
// using Audex.API.Helpers;
// using Audex.API.Services;
// using HotChocolate;
// using HotChocolate.Types;
// using Microsoft.Extensions.Logging;

// namespace Audex.API.GraphQL.Mutations
// {
//     [ExtendObjectType(Name = "Mutation")]
//     public class FileMutations
//     {
//         public async Task<string> UploadFile(
//             IFile f,
//             [Service] ILogger<FileMutations> logger,
//             [Service] IFileNodeService fileNodeService)
//         {
//             var file = FileHelpers.ReturnFormFile(f);
//             if (file != null && file.Length > 0)
//             {
//                 var fn = await fileNodeService.CreateAsync(file);

//                 logger.LogInformation($"File '{file.FileName} uploaded.'");
//                 return fn.Id.ToString("N");
//             }
//             logger.LogError($"File '{file.FileName} failed to upload.'");
//             throw new InvalidOperationException("Not a file.");

//             return "nice";
//         }
//     }
// }