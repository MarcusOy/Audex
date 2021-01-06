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

        [HttpPost, Authorize] // TODO: readd authorization
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        [DisableRequestSizeLimit]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Post([FromForm] FilesUploadedModel model)
        {

            if (model.File != null && model.File.Length > 0)
            {
                // Get User
                var user = _context.Users.FirstOrDefault(
                            u => u.Username == HttpContext.User.Identity.Name);

                // Create and add a new unparented FileNode
                var fn = new FileNode
                {
                    IsDirectory = false,
                    Name = model.File.FileName.Split(".")[0],
                    FileExtension = model.File.FileName.Split(".")[1],
                    FileSize = model.File.Length,
                    DateCreated = DateTime.UtcNow,
                    ExpiryDate = DateTime.UtcNow.AddDays(1),
                    OwnerUser = user,
                    UploadedByDeviceId = model.DeviceId,
                    // ParentFileNodeId = _context.Drives.FirstOrDefault(
                    //     d => d.OwnerUserId == user.Id).RootFileNodeId,
                };
                _context.FileNodes.Add(fn);
                _context.SaveChanges();

                try
                {
                    // Now add the file to the filesystem with name of the FileNode's id

                    var uid = fn.Id;
                    var path = PathHelper.GetProperPath(_settings.FileSystem.Temporary);
                    var filePath = Path.Combine(path, uid.ToString());

                    FileInfo fileInfo = new FileInfo(filePath);
                    fileInfo.Directory.Create();

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await model.File.CopyToAsync(stream);
                    }

                    // Mark file as temporary in case user does not complete 
                    fileInfo.Attributes = FileAttributes.Temporary;

                    return Ok(new { uid });
                }
                catch (Exception e)
                {
                    _context.FileNodes.Remove(fn);
                    _context.SaveChanges();

                    return BadRequest(e.Message);
                }
            }
            else
                return BadRequest("Not a file.");

        }

        public class FilesUploadedModel
        {
            [FromForm(Name = "file")]
            public IFormFile File { get; set; }

            [FromForm(Name = "deviceId")]
            public Guid DeviceId { get; set; }
        }
    }
}
