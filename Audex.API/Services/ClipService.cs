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
    public interface IClipService
    {
        /// <summary>
        /// Creates a clip with provided string content.
        /// </summary>
        /// <param name="content">The text contained in the clip</param>
        /// <param name="isSecure">Whether or not the content is encrypted or not</param>
        /// <returns></returns>
        Task<Clip> CreateAsync(string content, bool isSecure = false);
        /// <summary>
        /// Creates a clip with starter text defined by AudexSettings.Clips.StarterClip
        /// </summary>
        /// <param name="userId">Who the clip will be generated for</param>
        /// <returns></returns>
        Task<Clip> CreateStartingClipAsync(Guid? userId = null);

    }

    public class ClipService : IClipService
    {
        private readonly ILogger<ClipService> _logger;
        private readonly AudexDBContext _dbContext;
        private readonly AudexSettings _settings;
        private readonly IIdentityService _idService;

        public ClipService(IHttpContextAccessor context,
                            ILogger<ClipService> logger,
                            AudexDBContext dbContext,
                            IOptions<AudexSettings> settings,
                            IIdentityService idService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _idService = idService;
        }

        public async Task<Clip> CreateAsync(string content, bool isSecure = false)
        {
            var clip = new Clip
            {
                Content = content,
                IsSecured = isSecure,
                OwnerUserId = _idService.CurrentUser.Id,
                UploadedByDeviceId = _idService.CurrentDevice.Id,
            };
            await _dbContext.Clips.AddAsync(clip);
            await _dbContext.SaveChangesAsync();

            return clip;
        }

        public async Task<Clip> CreateStartingClipAsync(Guid? userId = null)
        {
            var clip = new Clip
            {
                Content = _settings.Clips.StarterClip,
                IsSecured = false,
                OwnerUserId = userId ?? _idService.CurrentUser.Id,
                UploadedByDeviceId = _dbContext.Devices
                        .FirstOrDefault(d => d.DeviceType.Name == "Audex Server")
                        .Id,
            };
            await _dbContext.Clips.AddAsync(clip);
            await _dbContext.SaveChangesAsync();

            return clip;
        }
    }
}