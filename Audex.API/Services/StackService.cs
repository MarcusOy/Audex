using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

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
        public Task<Stack> Create(Stack stack, List<FileNode> files);

        public Task<Stack> Create(Stack stack, string[] filePaths, Guid? userId = null);
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
                            AudexSettings settings,
                            IFileNodeService fnService)
        {
            _context = context;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings;
            _fnService = fnService;
        }

        public async Task<Stack> Create(Stack stack, List<FileNode> files)
        {

            return stack;
        }

        public async Task<Stack> Create(Stack stack, string[] filePaths, Guid? userId = null)
        {
            // var userExpression = userId is null ?
            //     (Func<User, bool>)(u => u.Username == _context.HttpContext.User.Identity.Name)
            //     : (u => u.Id == userId);
            // var user = _dbContext.Users.FirstOrDefault(userExpression);




            // var fns = new List<FileNode>();

            // foreach (string p in filePaths)
            //     fns.Add(_fnService.Create())
            // _dbContext.Stack.Add(stack);

            return stack;
        }
    }
}