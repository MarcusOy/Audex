using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeTypes;

namespace Audex.API.Services
{
    public interface IStorageService
    {
        Task<FileNode> AddFile(FileNode fileNode, IFormFile uploadedFile);
        Task<FileNode> AddFile(FileNode fileNode, FileInfo file);
        Task<FileNode> PersistFile(FileNode file);

        bool TempFileExists(FileNode file);
        bool FileExists(FileNode file);
        void DeleteFile(FileNode file);

        Task<IActionResult> ServeFile(DownloadToken downloadToken);
    }

    public class LocalStorageService : IStorageService
    {
        private readonly IHttpContextAccessor _context;
        private readonly ILogger<LocalStorageService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;

        public LocalStorageService(
            IHttpContextAccessor context,
            ILogger<LocalStorageService> logger,
            AudexDBContext dbContext,
            IOptions<AudexSettings> settings)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
        }

        public async Task<FileNode> AddFile(FileNode fileNode, IFormFile uploadedFile)
        {
            var tempFileInfo = GetFileInfoInTemporary(fileNode);

            using (var stream = System.IO.File.Create(tempFileInfo.FullName))
            {
                await uploadedFile.CopyToAsync(stream);
            }

            // Mark file as temporary in case user does not complete 
            tempFileInfo.Attributes = FileAttributes.Temporary;
            return fileNode;
        }

        public async Task<FileNode> AddFile(FileNode fileNode, FileInfo file)
        {
            var tempFileInfo = GetFileInfoInTemporary(fileNode);

            await CopyFileAsync(file.FullName, tempFileInfo.FullName,
                new CancellationTokenSource().Token);

            // Mark file as temporary in case user does not complete 
            tempFileInfo.Attributes = FileAttributes.Temporary;
            return fileNode;
        }

        public bool FileExists(FileNode file)
        {
            return GetFileInfoInPersistent(file).Exists;
        }

        public bool TempFileExists(FileNode file)
        {
            return GetFileInfoInTemporary(file).Exists;
        }

        public async Task<FileNode> PersistFile(FileNode file)
        {
            if (FileExists(file))
            {
                _logger.LogInformation($"File (with FileNode id {file.Id}) is already persistent.");
                return file;
            }
            if (!TempFileExists(file))
            {
                _logger.LogError($"File (with FileNode id {file.Id}) does not exist.");
                return file;
            }

            var tf = GetFileInfoInTemporary(file);
            var pf = GetFileInfoInPersistent(file);

            await CopyFileAsync(tf.FullName, pf.FullName,
                new CancellationTokenSource().Token);
            tf.Delete();

            return file;
        }

        public void DeleteFile(FileNode file)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IActionResult> ServeFile(DownloadToken downloadToken)
        {
            try
            {
                var filePath = GetFileInfoInPersistent(downloadToken.FileNode).FullName;

                FileStream fs = File.Open(filePath, FileMode.Open);
                string mimetype = MimeTypeMap.GetMimeType(downloadToken.FileNode.FileExtension);
                return new FileStreamResult(fs, mimetype)
                {
                    FileDownloadName = downloadToken.FileNode.Name,
                    LastModified = DateTime.UtcNow
                };
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult($"Something happened while retrieving your file. {e.Message}");
            }
            finally
            {
                downloadToken.NumberOfUses++;
                _dbContext.DownloadTokens.Update(downloadToken);
                await _dbContext.SaveChangesAsync();
            }
        }


        private FileInfo GetFileInfoInPersistent(FileNode file)
        {
            var filePath = GetFilePathInPersistent(file);

            FileInfo fileInfo = new FileInfo(filePath);
            fileInfo.Directory.Create();

            return fileInfo;
        }

        private string GetFilePathInPersistent(FileNode file)
        {
            var path = PathHelper.GetProperPath(_settings.FileSystem.Persistant);
            var userPath = Path.Combine(path, file.OwnerUserId.ToString());
            return Path.Combine(path, file.Id.ToString());
        }

        private FileInfo GetFileInfoInTemporary(FileNode file)
        {
            var filePath = GetFilePathInTemp(file);

            FileInfo fileInfo = new FileInfo(filePath);
            fileInfo.Directory.Create();

            return fileInfo;
        }

        private string GetFilePathInTemp(FileNode file)
        {
            var path = PathHelper.GetProperPath(_settings.FileSystem.Temporary);
            var userPath = Path.Combine(path, file.OwnerUserId.ToString());
            return Path.Combine(path, file.Id.ToString());
        }

        private static async Task CopyFileAsync(string sourceFile, string destinationFile, CancellationToken cancellationToken)
        {
            try
            {
                var fileOptions = FileOptions.Asynchronous | FileOptions.SequentialScan;
                var bufferSize = 4096;

                using (var sourceStream =
                      new FileStream(sourceFile, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize, fileOptions))

                using (var destinationStream =
                      new FileStream(destinationFile, FileMode.CreateNew, FileAccess.Write, FileShare.None, bufferSize, fileOptions))

                    await sourceStream.CopyToAsync(destinationStream, bufferSize, cancellationToken)
                                               .ConfigureAwait(continueOnCapturedContext: false);
            }
            catch
            {
                throw new InvalidOperationException("Something went wrong copying a file.");
            }
        }
    }
}