using System.Security.AccessControl;
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
using Audex.API.GraphQL;
using Audex.API.Migrations;
using System.Security.Claims;
using Audex.API.GraphQL.Extensions;

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
            // services.AddDbContextFactory<AudexDBContext>(
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
            // .UseLazyLoadingProxies()
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
                    ValidIssuer = Configuration["Jwt:Issuer"], // TODO: dynamically change audience based on user
                    // RequireSignedTokens = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])) // TODO: generate random secret on initialization
                };
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
            });

            services.AddGraphQLServer()
                    .AddMutationType<Audex.API.GraphQL.Mutation>()
                    .AddQueryType<Audex.API.GraphQL.Query>()
                    .AddAuthorization()
                    .AddHttpRequestInterceptor(
                        (context, executer, builder, ct) =>
                        {
                            if (context.GetUser().Identity.IsAuthenticated)
                            {
                                builder.SetProperty("CurrentUser",
                                    new CurrentUser(
                                        Guid.Parse(context.User.FindFirstValue(ClaimTypes.NameIdentifier)),
                                        context.User.Identity.Name,
                                        context.User.Claims.Select(x => $"{x.Type} : {x.Value}").ToList()
                                    )
                                );
                            }

                            return new ValueTask(Task.CompletedTask);
                        }
                    )
                    // .AddErrorFilter<GraphQLErrorFilter>()
                    .AddFiltering()
                    .AddSorting();
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

                app.UseAuthentication();

                app.UseAuthorization();


                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapGraphQL("/api/v1/graphql");
                });

                app.UsePlayground("/api/v1/graphql");
            }

            dbContext.EnsureInitialData(identityService, logger); // TODO: use proper DI
        }
    }
}