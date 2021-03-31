using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Audex.API.Data;
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
        /// <param name="stack"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public Task<Stack> CreateAsync(Stack stack, List<FileNode> files);

        public Task<Stack> CreateAsync(Stack stack, string[] filePaths, Guid? userId = null);
        public Task<Stack> CreateStartingStackAsync(Guid userId);

    }

    public class StackService : IStackService
    {
        private readonly IHttpContextAccessor _context;
        private readonly ILogger<StackService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;

        private readonly IFileNodeService _fnService;

        public StackService(IHttpContextAccessor context,
                            ILogger<StackService> logger,
                            AudexDBContext dbContext,
                            IOptions<AudexSettings> settings,
                            IFileNodeService fnService)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _fnService = fnService;
        }

        public async Task<Stack> CreateAsync(Stack stack, List<FileNode> files)
        {
            throw new NotImplementedException();
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
    }
}