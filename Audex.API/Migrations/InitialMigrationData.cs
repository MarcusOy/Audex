using System;
using System.Linq;
using Audex.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Audex.API.Migrations
{
    public static class InitialMigrationData
    {
        public static void EnsureInitialData(this AudexDBContext dbContext,
                                             IIdentityService identityService,
                                             ILogger<Startup> logger)
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
                                //   "UploadFiles",
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
                    var p = identityService.GenerateRandomPassword(16);
                    var s = identityService.GenerateSalt();
                    var u = new User
                    {
                        Id = Guid.NewGuid(),
                        Username = un,
                        Password = identityService.GenerateHashedPassword(p, s.AsBytes),
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

                    // Adding starting drive and a root file node
                    var fn = new FileNode
                    {
                        Id = Guid.NewGuid(),
                        IsDirectory = true,
                        Name = $"{un}'s Root",
                        DateCreated = DateTime.UtcNow,
                        OwnerUser = u,
                        ParentFileNodeId = null,
                        UploadedByDevice = d
                    };
                    dbContext.FileNodes.Add(fn);
                    dbContext.SaveChanges();

                    var dr = new Drive
                    {
                        Id = Guid.NewGuid(),
                        OwnerUser = u,
                        RootFileNode = fn
                    };
                    dbContext.Drives.Add(dr);
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
