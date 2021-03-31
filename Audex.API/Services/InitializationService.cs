using System.Runtime.Intrinsics.X86;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Audex.API.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Audex.API.Models.Auth;
using Audex.API.Data;

namespace Audex.API.Services
{
    public interface IInitializationService
    {
        public void InitializeDatabase();
    }
    public class InitializationService : IInitializationService
    {
        private readonly AudexDBContext dbContext;
        private readonly IIdentityService identityService;
        private readonly ILogger<InitializationService> logger;
        private readonly IStackService stackService;
        public InitializationService(AudexDBContext dbContext,
                                     IIdentityService identityService,
                                     ILogger<InitializationService> logger,
                                     IStackService stackService)
        {
            this.dbContext = dbContext;
            this.identityService = identityService;
            this.logger = logger;
            this.stackService = stackService;
        }
        public void InitializeDatabase()
        {
            // Database initial data checks
            using (logger.BeginScope("Audex is checking the configured database..."))
            {
                // Apply pending migrations
                dbContext.Database.Migrate();

                // Checking admin account
                if (dbContext.Users.FirstOrDefault(u => u.Username == "admin") == null)
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
                        Group = dbContext.Groups.FirstOrDefault(g => g.Name == "Administrator")
                    };
                    dbContext.Users.Add(u);
                    dbContext.SaveChanges();

                    // Adding a device for the server
                    var d = new Device
                    {
                        Id = Guid.NewGuid(),
                        Name = "Audex Server",
                        User = u,
                        DeviceType = dbContext.DeviceTypes.FirstOrDefault(d => d.Name == "Audex Server")
                    };
                    dbContext.Devices.Add(d);
                    dbContext.SaveChanges();

                    // Starting Stack (as an example)
                    stackService.CreateStartingStackAsync(u.Id).Wait();

                    logger.LogInformation($@"
                        Admin account was not initialized, so a new one has been created.
                        Use the following account to login:

                        Username: {un}
                        Password: {p}
                    ");

                }

                dbContext.SaveChanges();
            }
        }
    }
}
