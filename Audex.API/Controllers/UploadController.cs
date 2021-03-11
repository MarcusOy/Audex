using System.Net;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Audex.API.Services;
using Audex.API.Helpers;

namespace Audex.API.Controllers
{
    [ApiController, Route("api/v1/[controller]"), EnableCors("APICors")]
    public class UploadController : ControllerBase
    {

        private readonly ILogger<UploadController> _logger;
        private readonly AudexDBContext _context;
        private readonly AudexSettings _settings;

        private readonly IFileNodeService _fileNodeService;

        public UploadController(ILogger<UploadController> logger,
                                AudexDBContext context,
                                IOptions<AudexSettings> settings,
                                IFileNodeService fileNodeService)
        {
            _logger = logger;
            _context = context;
            _settings = settings.Value;
            _fileNodeService = fileNodeService;
        }

        [HttpGet, Authorize]
        public String Get()
        {
            var user = HttpContext.User;

            return $@"Currently logged in as user: {user.Identity.Name}.
                      Go ahead and make a file upload!";
        }

        [HttpPost, Authorize] // TODO: readd authorization
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        [DisableRequestSizeLimit]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Post([FromForm] FilesUploadedModel model)
        {
            if (model.File != null && model.File.Length > 0)
            {
                var fn = await _fileNodeService.Create(model.File);
                return Ok(new { fn.Id });
            }
            return BadRequest("Not a file.");
        }

        public class FilesUploadedModel
        {
            [FromForm(Name = "file")]
            public IFormFile File { get; set; } // TODO: maybe use MultipartReader?
        }
    }
}
