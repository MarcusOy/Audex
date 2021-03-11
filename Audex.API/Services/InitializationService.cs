using System.Runtime.Intrinsics.X86;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Audex.API.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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
        private readonly IFileNodeService fnService;
        public InitializationService(AudexDBContext dbContext,
                                     IIdentityService identityService,
                                     ILogger<InitializationService> logger,
                                     IFileNodeService fnService)
        {
            this.dbContext = dbContext;
            this.identityService = identityService;
            this.logger = logger;
            this.fnService = fnService;
        }
        public void InitializeDatabase()
        {
            // Database initial data checks
            using (logger.BeginScope("Audex is checking the configured database..."))
            {
                // Apply pending migrations
                dbContext.Database.Migrate();

                // Checking Role entities
                if (dbContext.Roles.Count() < 7)
                {
                    logger.LogWarning("Roles may not be initialized.");
                    string[] r = {"Login",
                                  "UploadFiles",
                                  "ViewFiles",
                                  "UserManagement",
                                  "DeviceManagement",
                                  "PrivatelyShareFiles",
                                  "PubliclyShareFiles"};
                    var m = "";
                    foreach (string s in r)
                    {
                        if (dbContext.Roles.FirstOrDefault(r => r.Name == s) == null)
                        {
                            dbContext.Roles.Add(new Role
                            {
                                Name = s
                            });
                            m += $"The {s} role has been initialized.\n";
                        }
                    }
                    dbContext.SaveChanges();

                    logger.LogInformation(m);

                }

                // Checking Group entities
                if (dbContext.Groups.Count() < 3)
                {
                    logger.LogWarning("Groups may not be initialized.");
                    string[] g = {"Administrator",
                                  "Member",
                                  "Viewer"};
                    var m = "";
                    foreach (string s in g)
                    {
                        if (dbContext.Groups.FirstOrDefault(g => g.Name == s) == null)
                        {
                            dbContext.Groups.Add(new Group
                            {
                                Name = s
                            });
                            m += $"The {s} group has been initialized.\n";
                        }
                    }
                    dbContext.SaveChanges();

                    logger.LogInformation(m);
                }

                // Checking GroupRole entities
                if (dbContext.GroupRoles.Count() < 11)
                {
                    logger.LogWarning("GroupRoles may not be initialized.");
                    var gr = new (string Group, string Role)[]
                    {
                        ("Administrator", "Login"),
                        ("Administrator", "UploadFiles"),
                        ("Administrator", "ViewFiles"),
                        ("Administrator", "UserManagement"),
                        ("Administrator", "DeviceManagement"),
                        ("Administrator", "PrivatelyShareFiles"),
                        ("Administrator", "PubliclyShareFiles"),

                        ("Member", "Login"),
                        ("Member", "UploadFiles"),
                        ("Member", "ViewFiles"),
                        ("Member", "PrivatelyShareFiles"),
                    };
                    var m = "";

                    foreach ((string Group, string Role) s in gr)
                    {
                        if (dbContext.GroupRoles
                            .Include(gr => gr.Group)
                            .Include(gr => gr.Role)
                            .FirstOrDefault(gr => gr.Group.Name == s.Group
                                              && gr.Role.Name == s.Role) == null)
                        {
                            dbContext.Add(new GroupRole
                            {
                                GroupId = dbContext.Groups.FirstOrDefault(g => g.Name == s.Group).Id,
                                RoleId = dbContext.Roles.FirstOrDefault(r => r.Name == s.Role).Id,
                            });
                        }
                        m += $"The role {s.Role} has been added to group {s.Group}.\n";
                    }
                    dbContext.SaveChanges();

                    logger.LogInformation(m);
                }

                // Checking Device entities
                if (dbContext.DeviceTypes.Count() < 10)
                {
                    logger.LogWarning("DeviceTypes may not be initialized.");
                    string[] d = {"Audex Server",
                                  "Windows",
                                  "MacOS",
                                  "Linux",
                                  "Web",
                                  "iOS",
                                  "Android",
                                  "Other"};
                    var m = "";
                    foreach (string s in d)
                    {
                        if (dbContext.DeviceTypes.FirstOrDefault(d => d.Name == s) == null)
                        {
                            dbContext.DeviceTypes.Add(new DeviceType
                            {
                                Name = s
                            });
                            m += $"The {s} DeviceType has been initialized.\n";
                        }
                    }
                    dbContext.SaveChanges();

                    logger.LogInformation(m);
                }

                // Checking admin account
                if (dbContext.Users.FirstOrDefault(u => u.Username == "admin") == null)
                {
                    // Adding admin user and saving to get id
                    var un = "admin"; //TODO: Allow user to specify
                    var p = SecurityHelpers.GenerateRandomPassword(16);
                    var s = SecurityHelpers.GenerateSalt();
                    var u = new User
                    {
                        Id = Guid.NewGuid(),
                        Username = un,
                        Password = SecurityHelpers.GenerateHashedPassword(p, s.AsBytes),
                        DateCreated = DateTime.UtcNow,
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
                    var sS = new Stack
                    {
                        OwnerUser = u,
                    };

                    var root = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);

                    var fs = new List<FileNode>();
                    foreach (string path in Directory.GetFiles(Path.Combine(root, "Assets/StarterFiles")))
                    {
                        fs.Add(fnService.Create(path).Result);
                    }

                    sS.Files = fs;
                    dbContext.SaveChanges();

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
