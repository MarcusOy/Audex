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
using Audex.Helpers;

namespace Audex.API.Controllers
{
    [ApiController, Route("api/v1/[controller]"), EnableCors("APICors")]
    public class UploadController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<UploadController> _logger;
        private readonly AudexDBContext _context;
        private readonly AudexSettings _settings;

        public UploadController(ILogger<UploadController> logger,
                                AudexDBContext context,
                                IOptions<AudexSettings> settings)
        {
            _logger = logger;
            _context = context;
            _settings = settings.Value;
        }

        [HttpGet, Authorize]
        public String Get()
        {
            var user = HttpContext.User;

            return $@"Currently logged in as user: {user.Identity.Name}.
                      Go ahead and make a file upload!";
        }

        [HttpPost] // TODO: readd authorization
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        [DisableRequestSizeLimit]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Post([FromForm] FilesUploadedModel model)
        {
            try
            {
                if (model.File != null && model.File.Length > 0)
                {
                    var uid = Guid.NewGuid();
                    var filePath = PathHelper.GetProperPath(Path.Combine(_settings.FileSystem.Temporary, uid.ToString()));

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await model.File.CopyToAsync(stream);
                    }

                    // Mark file as temporary in case user does not complete 
                    FileInfo fileInfo = new FileInfo(filePath);
                    fileInfo.Attributes = FileAttributes.Temporary;



                    // Process uploaded files
                    // Don't rely on or trust the FileName property without validation.

                    return Ok(new { uid });
                }
                else
                    return BadRequest("Not a file.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        public class FilesUploadedModel
        {
            [FromForm(Name = "file")]
            public IFormFile File { get; set; }
        }
    }
}
