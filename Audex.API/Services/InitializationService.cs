using System.Runtime.Intrinsics.X86;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Audex.API.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using Audex.API.Data;
using Audex.API.Models;

namespace Audex.API.Services
{
    public interface IInitializationService
    {
        public void InitializeDatabase();
    }
    public class InitializationService : IInitializationService
    {
        private readonly AudexDBContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly ILogger<InitializationService> _logger;
        private readonly IStackService _stackService;
        public InitializationService(AudexDBContext dbContext,
                                     IIdentityService identityService,
                                     ILogger<InitializationService> logger,
                                     IStackService stackService,
                                     ITwoFactorService twoFactorService)
        {
            this._dbContext = dbContext;
            this._identityService = identityService;
            this._logger = logger;
            this._stackService = stackService;
            _twoFactorService = twoFactorService;
        }
        public void InitializeDatabase()
        {
            // Database initial data checks
            using (_logger.BeginScope("Audex is checking the configured database..."))
            {
                // Apply pending migrations
                _dbContext.Database.Migrate();

                // Checking admin account
                if (_dbContext.Users.FirstOrDefault(u => u.Username == "admin") == null)
                {
                    // Adding admin user and saving to get id
                    var un = "admin";
                    var p = SecurityHelpers.GenerateRandomPassword(16);
                    var s = SecurityHelpers.GenerateSalt();
                    var u = new User
                    {
                        Id = Guid.NewGuid(),
                        Username = un,
                        Password = SecurityHelpers.GenerateHashedPassword(p, s.AsBytes),
                        Active = true,
                        Salt = s.AsString,
                        Group = _dbContext.Groups.FirstOrDefault(g => g.Name == "Administrator")
                    };
                    _dbContext.Users.Add(u);
                    _dbContext.SaveChanges();

                    // Adding a device for the server
                    var d = new Device
                    {
                        Id = Guid.NewGuid(),
                        Name = "Audex Server",
                        User = u,
                        DeviceType = _dbContext.DeviceTypes.FirstOrDefault(d => d.Name == "Audex Server")
                    };
                    _dbContext.Devices.Add(d);
                    _dbContext.SaveChanges();

                    // Starting Stack (as an example)
                    _stackService.CreateStartingStackAsync(u.Id).Wait();
                    _twoFactorService.ResetTwoFactorAsync(u);

                    _dbContext.SaveChanges();

                    // Display admin credentials to user
                    _logger.LogInformation($@"
                        Admin account was not initialized, so a new one has been created.
                        Use the following account to login:

                        Username: {un}
                        Password: {p}
                    ");
                    _twoFactorService.AuthQRToTerminal(u);

                }

            }
        }
    }
}
