using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Audex.API.Data;
using Audex.API.Helpers;
using Audex.API.Models.Auth;
using Audex.API.Models.Stacks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Audex.API.Services
{
    public interface IStackService
    {
        /// <summary>
        /// Create a stack from existing FileNodes
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        public Task<Stack> CreateAsync(List<Guid> fileIds);
        public Task<Stack> CreateAsync(Stack stack, string[] filePaths, Guid? userId = null);
        public Task<Stack> Ensure(Guid stackId, List<Guid> fileIds);
        public Task<Stack> CreateStartingStackAsync(Guid userId);

    }

    public class StackService : IStackService
    {
        private readonly IHttpContextAccessor _context;
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
            _context = context;
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
                OwnerUserId = new Guid(_context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)
                    .Value),
                UploadedByDeviceId = new Guid(_context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == "deviceId")
                    .Value),
                Files = _dbContext.FileNodes
                    .Where(fn => filesIds.Contains(fn.Id))
                    .ToList()
            };
            await _dbContext.SaveChangesAsync();
            PersistFileNodes(stack.Files);

            return stack;
        }

        public async Task<Stack> CreateAsync(Stack stack, string[] filePaths, Guid? userId = null)
        {
            var userExpression = userId is null ?
                (Func<User, bool>)(u => u.Username == _context.HttpContext.User.Identity.Name)
                : (u => u.Id == userId);
            var user = _dbContext.Users.FirstOrDefault(userExpression);


            var fns = new List<FileNode>();
            foreach (string p in filePaths)
                fns.Add(await _fnService.CreateAsync(p));

            stack.Files = fns;
            await _dbContext.Stack.AddAsync(stack);
            await _dbContext.SaveChangesAsync();

            return stack;
        }

        public async Task<Stack> Ensure(Guid stackId, List<Guid> fileIds)
        {
            var stack = _dbContext.Stack
                .Where(s => s.DeletedOn == null)
                .Where(s => s.OwnerUserId == new Guid(_context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value))
                .FirstOrDefault(s => s.Id == stackId);

            if (stack is null)
                throw new InvalidOperationException("Invalid stack id.");

            stack.Files = stack.Files
                .Intersect(_dbContext.FileNodes
                    .Where(fn => fileIds.Contains(fn.Id)))
                .ToList();
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