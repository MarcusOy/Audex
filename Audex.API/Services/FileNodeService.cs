using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Audex.API.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;


namespace Audex.API.Services
{
    public interface IFileNodeService
    {
        /// <summary>
        /// Create FileNode from a present file on disk.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public Task<FileNode> Create(string path);
        /// <summary>
        /// Create FileNode from an upload. DeviceId not needed
        /// as usually the Audex Server device will use this method.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public Task<FileNode> Create(IFormFile file);
    }

    public class FileNodeService : IFileNodeService
    {
        private readonly IHttpContextAccessor _context;
        private readonly ILogger<FileNodeService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        public FileNodeService(IHttpContextAccessor context,
                               ILogger<FileNodeService> logger,
                               AudexDBContext dbContext,
                               IOptions<AudexSettings> settings)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
        }

        public async Task<FileNode> Create(IFormFile file)
        {
            // Get User
            var user = _dbContext.Users.FirstOrDefault(
                        u => u.Username == _context.HttpContext.User.Identity.Name);
            var deviceId = _context.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "deviceId").Value;

            var fileNameParts = file.FileName.Split(".");
            var fileExtension = fileNameParts[fileNameParts.Length - 1];

            // Create and add a new unparented FileNode
            var fn = new FileNode
            {
                Name = file.FileName,
                FileExtension = fileExtension,
                FileSize = file.Length,
                DateCreated = DateTime.UtcNow,
                OwnerUser = user,
                UploadedByDeviceId = new Guid(deviceId),
                // ParentFileNodeId = _context.Drives.FirstOrDefault(
                //     d => d.OwnerUserId == user.Id).RootFileNodeId,
            };
            _dbContext.FileNodes.Add(fn);
            _dbContext.SaveChanges();

            try
            {
                // Now add the file to the filesystem with name of the FileNode's id
                UploadFileToWorkingDirectory(file, fn.Id.ToString());
            }
            catch (Exception e)
            {
                _dbContext.FileNodes.Remove(fn);
                _dbContext.SaveChanges();

                throw new InvalidOperationException(e.Message);
            }

            return fn;
        }

        public async Task<FileNode> Create(string path)
        {
            // Get User
            var user = _dbContext.Users.FirstOrDefault(
                        u => u.Username == _context.HttpContext.User.Identity.Name);
            var deviceId = _context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId").Value
                ?? _dbContext.Devices.
                     FirstOrDefault(d => d.Name == "Audex Server").Id.ToString();

            if (!File.Exists(path))
                throw new FileNotFoundException("File does not exist");

            var file = new FileInfo(path);

            // Create and add a new unparented FileNode
            var fn = new FileNode
            {
                Name = file.Name,
                FileExtension = file.Extension,
                FileSize = file.Length,
                DateCreated = DateTime.UtcNow,
                OwnerUser = user,
                UploadedByDeviceId = new Guid(deviceId),
                // ParentFileNodeId = _context.Drives.FirstOrDefault(
                //     d => d.OwnerUserId == user.Id).RootFileNodeId,
            };
            _dbContext.FileNodes.Add(fn);
            _dbContext.SaveChanges();

            try
            {
                // Now add the file to the filesystem with name of the FileNode's id
                CopyFileToWorkingDirectory(file, fn.Id.ToString());
            }
            catch (Exception e)
            {
                _dbContext.FileNodes.Remove(fn);
                _dbContext.SaveChanges();

                throw new InvalidOperationException(e.Message);
            }

            return fn;


        }

        private async void UploadFileToWorkingDirectory(IFormFile file, string name)
        {
            var fileInfo = GetNewPathInTemporary(name);

            using (var stream = System.IO.File.Create(fileInfo.FullName))
            {
                await file.CopyToAsync(stream);
            }

            // Mark file as temporary in case user does not complete 
            fileInfo.Attributes = FileAttributes.Temporary;
        }

        private void CopyFileToWorkingDirectory(FileInfo file, string name)
        {
            var fileInfo = GetNewPathInTemporary(name);

            System.IO.File.Copy(file.FullName, fileInfo.FullName);

            // Mark file as temporary in case user does not complete 
            fileInfo.Attributes = FileAttributes.Temporary;
        }

        private FileInfo GetNewPathInTemporary(string name)
        {
            var path = PathHelper.GetProperPath(_settings.FileSystem.Temporary);
            var filePath = Path.Combine(path, name.ToString());

            FileInfo fileInfo = new FileInfo(filePath);
            fileInfo.Directory.Create();

            return fileInfo;
        }
    }
}