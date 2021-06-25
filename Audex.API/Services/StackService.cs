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
    public interface IStackService
    {
        /// <summary>
        /// Create a stack from existing FileNodes.
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        Task<Stack> CreateAsync(List<Guid> fileIds);
        /// <summary>
        /// Create a stack from files from the filesystem.
        /// Usually used for creating the starting stack for a user.
        /// </summary>
        /// <param name="stack"></param>
        /// <param name="filePaths"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<Stack> CreateAsync(Stack stack, string[] filePaths, Guid? userId = null);
        /// <summary>
        /// Makes sure that the fileIds passed are inside the
        /// specified stack.
        /// </summary>
        /// <param name="stackId"></param>
        /// <param name="fileIds"></param>
        /// <returns></returns>
        Task<Stack> Ensure(Guid stackId, List<Guid> fileIds);
        Task<Stack> CreateStartingStackAsync(Guid userId);

    }

    public class StackService : IStackService
    {
        private readonly HttpContext _context;
        private readonly ILogger<StackService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        private readonly IFileNodeService _fnService;
        private readonly IStorageService _storageService;


        public StackService(IHttpContextAccessor context,
                            ILogger<StackService> logger,
                            AudexDBContext dbContext,
                            IOptions<AudexSettings> settings,
                            IFileNodeService fnService,
                            IStorageService storageService)
        {
            _context = context.HttpContext;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _fnService = fnService;
            _storageService = storageService;
        }

        public async Task<Stack> CreateAsync(List<Guid> filesIds)
        {
            var stack = new Stack
            {
                OwnerUserId = new Guid(_context.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                    .Value),
                UploadedByDeviceId = new Guid(_context.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId")
                    .Value),
                Files = _dbContext.FileNodes
                    .Where(fn => filesIds.Contains(fn.Id))
                    .ToList()
            };
            await _dbContext.Stack.AddAsync(stack);
            await _dbContext.SaveChangesAsync();
            PersistFileNodes(stack.Files);

            return stack;
        }

        public async Task<Stack> CreateAsync(Stack stack, string[] filePaths, Guid? userId = null)
        {
            var userExpression = userId is null ?
                (Func<User, bool>)(u => u.Username == _context.User.Identity.Name)
                : (u => u.Id == userId);
            var user = _dbContext.Users.FirstOrDefault(userExpression);


            var fns = new List<FileNode>();
            foreach (string p in filePaths)
                fns.Add(await _fnService.CreateAsync(p));

            stack.Files = fns;
            await _dbContext.Stack.AddAsync(stack);
            await _dbContext.SaveChangesAsync();
            PersistFileNodes(stack.Files);

            return stack;
        }

        public async Task<Stack> Ensure(Guid stackId, List<Guid> fileIds)
        {
            var userid = new Guid(_context.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var stack = _dbContext.Stack
                .Include(s => s.Files)
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == userid)
                .FirstOrDefault(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidOperationException("Invalid stack id.");

            stack.Files = _dbContext.FileNodes
                .Where(fn => fileIds.Contains(fn.Id)).ToList();
            await _dbContext.SaveChangesAsync();
            PersistFileNodes(stack.Files);


            return stack;
        }

        public async Task<Stack> CreateStartingStackAsync(Guid userId)
        {
            var root = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            var folder = Path.Combine(root, "Assets/StarterStack");
            var paths = Directory.GetFiles(folder);

            var s = new Stack
            {
                OwnerUserId = userId,
                UploadedByDevice = _dbContext.Devices
                    .FirstOrDefault(d => d.DeviceType.Name == "Audex Server")
            };

            return await CreateAsync(s, paths, userId);
        }

        private async void PersistFileNodes(List<FileNode> files)
        {
            foreach (FileNode fn in files)
            {
                await _storageService.PersistFile(fn);
            }
        }
    }
}