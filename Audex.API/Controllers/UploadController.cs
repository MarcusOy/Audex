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

        public UploadController(ILogger<UploadController> logger, AudexDBContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet, Authorize]
        public IEnumerable<WeatherForecast> Get()
        {
            var user = HttpContext.User;
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = $"Currently logged in user: {user.Identity.Name}"
            })
            .ToArray();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] FilesUploadedModel model)
        {
            long size = model.Files.Sum(f => f.Length);

            foreach (var formFile in model.Files)
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.GetTempFileName();

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok(new { count = model.Files.Count, size });
        }

        public class FilesUploadedModel
        {
            [FromForm(Name = "file")]
            public List<IFormFile> Files { get; set; }
            public string Key { get; set; }

        }
    }
}
