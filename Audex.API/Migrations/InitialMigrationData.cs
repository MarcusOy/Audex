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

                // Checking admin account
                if (dbContext.Users.FirstOrDefault(u => u.Username == "admin") == null)
                {
                    var u = "admin"; //TODO: Allow user to specify
                    var p = identityService.GenerateRandomPassword(16);
                    var s = identityService.GenerateSalt();
                    dbContext.Users.Add(new User
                    {
                        Id = new Guid(),
                        Username = "admin",
                        Password = identityService.GenerateHashedPassword(p, s.AsBytes),
                        DateCreated = DateTime.UtcNow,
                        Active = true,
                        Salt = s.AsString,
                        GroupId = 1
                    });
                    logger.LogInformation($@"
                        Admin account was not initialized, so a new one has been created.
                        Use the following account to login:

                        Username: {u}
                        Password: {p}
                    ");

                }

                // Checking Role entities
                if (dbContext.Roles.Count() < 7)
                {
                    logger.LogWarning("Roles may not be initialized.");
                    string[] r = {"Login",
                                  "UploadFiles",
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
                    logger.LogInformation(m);
                }
                dbContext.SaveChanges();
            }
        }
    }
}
