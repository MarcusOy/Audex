using System.Text;
using System.Reflection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Audex.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Interceptors;

namespace Audex.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add API Controllers
            services.AddControllers();

            // Create ConnectionString
            var cs = new System.Data.Common.DbConnectionStringBuilder();
            cs["Server"] = "localhost";
            cs["Port"] = "3306";
            cs["Database"] = "audex";
            cs["User"] = "audexapp";
            cs["Password"] = "!audexapp!";

            // Add EntityFramework Context
            services.AddDbContextPool<AudexDBContext>(
                dbContextOptions => dbContextOptions
                    .UseMySql(
                        cs.ConnectionString,
                        new MySqlServerVersion(new Version(5, 7, 32)),
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend))
                    // Everything from this point on is optional but helps with debugging.
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors()
            );

            // Setupt CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy(name: "APICors",
                builder =>
                {
                    // builder.AllowAnyOrigin();
                    builder.WithOrigins("http://localhost:3000");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            // Added custom JWT Identity Authentication Service
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddHttpContextAccessor();

            // Added JWT authenitcation
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = "audience", // TODO: dynamically change audience based on user
                    ValidIssuer = "issuer", // TODO: dynamically change audience based on user
                    RequireSignedTokens = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secret")) // TODO: generate random secret on initialization
                };
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
            });

            services.AddGraphQLServer()
                    .AddMutationType<Audex.API.GraphQL.Mutation>()
                    .AddQueryType<Audex.API.GraphQL.Query>()
                    .AddAuthorization();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app,
                             IWebHostEnvironment env,
                             AudexDBContext dbContext,
                             IIdentityService identityService,
                             ILogger<Startup> logger)
        {
            using (logger.BeginScope("Audex is configuring..."))
            {
                if (env.IsDevelopment())
                {
                    logger.LogInformation("Audex is running in development mode.");
                    app.UseDeveloperExceptionPage();
                }

                // app.UseHttpsRedirection(); //TODO: Reenable this

                app.UseRouting();

                app.UseCors("APICors");

                app.UseAuthorization();

                app.UseAuthentication();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapGraphQL("/graphql");
                });

                app.UsePlayground("/graphql");
            }

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
                    logger.LogWarning("Admin account was not initialized, so a new one has been created.");
                    logger.LogInformation("Use the following account to login:");
                    logger.LogInformation($"Username: {u}");
                    logger.LogInformation($"Password: {p}");

                }
                // Checking Group entities
                if (dbContext.Groups.Count() < 3)
                {
                    logger.LogWarning("Groups are not initialized.");
                    if (dbContext.Groups.FirstOrDefault(g => g.Name == "Administrator") == null)
                    {
                        dbContext.Groups.Add(new Group
                        {
                            Id = 1,
                            Name = "Administrator"
                        });
                        logger.LogInformation("The Administrator group has been initialized.");
                    }
                    if (dbContext.Groups.FirstOrDefault(g => g.Name == "Member") == null)
                    {
                        dbContext.Groups.Add(new Group
                        {
                            Id = 2,
                            Name = "Member"
                        });
                        logger.LogInformation("The Member group has been initialized.");
                    }
                    if (dbContext.Groups.FirstOrDefault(g => g.Name == "Viewer") == null)
                    {
                        dbContext.Groups.Add(new Group
                        {
                            Id = 3,
                            Name = "Viewer"
                        });
                        logger.LogInformation("The Viewer group has been initialized.");
                    }
                }

                dbContext.SaveChanges();
            }
        }

    }
}
