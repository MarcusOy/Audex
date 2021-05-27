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
using Audex.API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.Controllers
{
    // [ApiController, Route("api/v1/[controller]"), EnableCors("APICors")]
    [ApiController, EnableCors("APICors")]
    public class DownloadController : ControllerBase
    {

        private readonly ILogger<DownloadController> _logger;
        private readonly AudexDBContext _context;
        private readonly AudexSettings _settings;

        private readonly IStorageService _storageService;

        public DownloadController(ILogger<DownloadController> logger,
                                AudexDBContext context,
                                IOptions<AudexSettings> settings,
                                IStorageService storageService)
        {
            _logger = logger;
            _context = context;
            _settings = settings.Value;
            _storageService = storageService;
        }

        [HttpGet, Route("api/v1/Download/{downloadId}")]
        public async Task<IActionResult> Get(string downloadId)
        {
            var downloadGuid = Guid.Parse(downloadId);
            if (downloadGuid == Guid.Empty)
                return BadRequest("No download token provided.");

            var userid = HttpContext.User.Identity.IsAuthenticated
                ? new Guid(HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value)
                : Guid.Empty;

            var token = _context.DownloadTokens
                    // .Where(d => d.DeletedOn == null)
                    // .Where(d => d.ExpiresOn <= DateTime.UtcNow)
                    // .Where(d => d.NumberOfUses < d.MaxNumberOfUses)
                    // .Where(d => d.ForUserId == userid)
                    .Include(d => d.FileNode)
                .FirstOrDefault(d => d.Id == downloadGuid);

            if (token != null)
            {
                _logger.LogInformation($"Serving file '{token.FileNode.Name}.'");
                return await _storageService.ServeFile(token);
            }
            _logger.LogError($"Download token '{downloadGuid} is invalid.'");
            return BadRequest("Invalid download token.");
        }

        public class FilesUploadedModel
        {
            [FromForm(Name = "file")]
            public IFormFile File { get; set; } // TODO: maybe use MultipartReader?
        }
    }
}
