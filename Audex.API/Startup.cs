using System.Text;
using System;
using System.Linq;
using System.Threading.Tasks;
using Audex.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using HotChocolate;
using HotChocolate.AspNetCore;
using Audex.API.GraphQL;
using System.Security.Claims;
using Audex.API.GraphQL.Extensions;
using Audex.API.GraphQL.Mutations;
using Audex.API.GraphQL.Queries;
using Audex.API.Data;
using Audex.API.GraphQL.Subscriptions;
using HotChocolate.Types;
using Microsoft.AspNetCore.Server.Kestrel.Core;

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
            // Sets max file size
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = 2147483648; // TODO: set max file size
            });

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
                            // .CharSetBehavior(CharSetBehavior.NeverAppend)
                            .UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery))
                    // Everything from this point on is optional but helps with debugging.
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors()
            );

            // Setup CORS policy
            services.AddCors(options =>
            {
                options.AddPolicy(name: "APICors",
                builder =>
                {
                    builder.AllowAnyOrigin();
                    // builder.WithOrigins("http://localhost:3000");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            // Added custom JWT Identity Authentication Service
            services.AddScoped<ITwoFactorService, TotpTwoFactorService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.Configure<AudexSettings>(o => Configuration.GetSection("Audex").Bind(o));
            services.AddHttpContextAccessor();

            // Added JWT authenitcation
            var tokenValidator = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidAudience = Configuration["Audex:Jwt:Audience"], // TODO: dynamically change audience based on user
                ValidIssuer = Configuration["Audex:Jwt:Issuer"], // TODO: dynamically change audience based on user
                // RequireSignedTokens = false,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Audex:Jwt:Key"])) // TODO: generate random secret on initialization
            };
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = tokenValidator;
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
            });
            services.AddSingleton<TokenValidationParameters>(tokenValidator);

            // Setting up GraphQL server
            services.AddGraphQLServer()
                .AddType<UploadType>()
                .BindRuntimeType<DateTime, UtcDateTimeType>()
                .AddMutationType(d => d.Name("Mutation"))
                    .AddTypeExtension<AuthMutations>()
                    .AddTypeExtension<StackMutations>()
                    .AddTypeExtension<FileMutations>()
                    .AddTypeExtension<DeviceMutations>()
                    .AddTypeExtension<TransferMutations>()
                    .AddTypeExtension<ClipMutations>()
                .AddQueryType(d => d.Name("Query"))
                    .AddTypeExtension<UserQueries>()
                    .AddTypeExtension<StackQueries>()
                    .AddTypeExtension<DeviceQueries>()
                    .AddTypeExtension<ClipQueries>()
                .AddSubscriptionType(d => d.Name("Subscription"))
                    .AddTypeExtension<StackSubscriptions>()
                    .AddTypeExtension<UserSubscriptions>()
                    .AddTypeExtension<ClipSubscriptions>()
                .AddAuthorization()
                .AddSocketSessionInterceptor<SubscriptionAuthMiddleware>()
                .AddInMemorySubscriptions()
                .AddErrorFilter<GraphQLErrorFilter>()
                .AddFiltering()
                .AddSorting();

            // Adding entity services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IStorageService, LocalStorageService>();
            services.AddScoped<IFileNodeService, FileNodeService>();
            services.AddScoped<IStackService, StackService>();
            services.AddScoped<IClipService, ClipService>();
            services.AddScoped<ITransferService, TransferService>();
            services.AddScoped<IInitializationService, InitializationService>();
            services.AddScoped<ISubscriptionService, SubscriptionService>();
            services.AddScoped<INotificationService, OneSignalNotificationService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app,
                             IWebHostEnvironment env,
                             AudexDBContext dbContext,
                             IIdentityService identityService,
                             IInitializationService initializationService,
                             ILogger<Startup> logger)
        {
            using (logger.BeginScope("Audex is configuring..."))
            {
                if (env.IsDevelopment())
                {
                    logger.LogInformation("Audex is running in development mode.");
                    // app.UseDeveloperExceptionPage();
                    app.UseStatusCodePages();
                }

                // app.UseHttpsRedirection(); //TODO: Reenable this
                app.UseWebSockets();
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

                initializationService.InitializeDatabase();
            }
        }
    }
}