using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models.Stacks;
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
        public Task<FileNode> CreateAsync(string path);
        /// <summary>
        /// Create FileNode from an upload. DeviceId not needed
        /// as usually the Audex Server device will use this method.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public Task<FileNode> CreateAsync(IFormFile file);
    }

    public class FileNodeService : IFileNodeService
    {
        private readonly IHttpContextAccessor _context;
        private readonly ILogger<FileNodeService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        private readonly IStorageService _storageService;

        public FileNodeService(
            IHttpContextAccessor context,
            ILogger<FileNodeService> logger,
            AudexDBContext dbContext,
            IOptions<AudexSettings> settings,
            IStorageService storageService)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _storageService = storageService;
        }

        public async Task<FileNode> CreateAsync(IFormFile file)
        {
            // Get User and Device
            var uname = _context.HttpContext.User.Identity.Name ?? "admin";
            var user = _dbContext.Users.FirstOrDefault(u => u.Username == uname);
            var deviceId = _context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId").Value
                ?? _dbContext.Devices.
                     FirstOrDefault(d => d.Name == "Audex Server").Id.ToString();

            var fileNameParts = file.FileName.Split(".");
            var fileExtension = fileNameParts[fileNameParts.Length - 1];

            // Create and add a new unparented FileNode
            var fn = new FileNode
            {
                Name = file.FileName,
                FileExtension = fileExtension,
                FileSize = file.Length,
                OwnerUser = user,
                UploadedByDeviceId = new Guid(deviceId),
                // ParentFileNodeId = _context.Drives.FirstOrDefault(
                //     d => d.OwnerUserId == user.Id).RootFileNodeId,
            };
            await _dbContext.FileNodes.AddAsync(fn);
            await _dbContext.SaveChangesAsync();

            try
            {
                // Now add the file to the filesystem with name of the FileNode's id
                await _storageService.AddFile(fn, file);
                // UploadFileToWorkingDirectory(file, fn.Id.ToString());
            }
            catch (Exception e)
            {
                _dbContext.FileNodes.Remove(fn);
                await _dbContext.SaveChangesAsync();

                throw new InvalidOperationException(e.Message);
            }

            return fn;
        }

        public async Task<FileNode> CreateAsync(string path)
        {
            // Get User and Device
            var uname = _context.HttpContext is null ? "admin"
                : _context.HttpContext.User.Identity.Name;
            var user = _dbContext.Users.FirstOrDefault(u => u.Username == uname);
            var deviceId = _context.HttpContext is null ?
                _dbContext.Devices.
                    FirstOrDefault(d => d.Name == "Audex Server").Id.ToString()
                : _context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId").Value;


            if (!File.Exists(path))
                throw new FileNotFoundException("File does not exist");

            var file = new FileInfo(path);

            // Create and add a new unparented FileNode
            var fn = new FileNode
            {
                Name = file.Name,
                FileExtension = file.Extension,
                FileSize = file.Length,
                OwnerUser = user,
                UploadedByDeviceId = new Guid(deviceId),
                // ParentFileNodeId = _context.Drives.FirstOrDefault(
                //     d => d.OwnerUserId == user.Id).RootFileNodeId,
            };
            await _dbContext.FileNodes.AddAsync(fn);
            await _dbContext.SaveChangesAsync();

            try
            {
                // Now add the file to the filesystem with name of the FileNode's id
                await _storageService.AddFile(fn, file);
                // CopyFileToWorkingDirectory(file, fn.Id.ToString());
            }
            catch (Exception e)
            {
                _dbContext.FileNodes.Remove(fn);
                await _dbContext.SaveChangesAsync();

                throw new InvalidOperationException(e.Message);
            }

            return fn;


        }
    }
}