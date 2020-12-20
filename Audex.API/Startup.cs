using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AudexDBContext dbContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("APICors");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


            dbContext.Database.Migrate();

        }
    }
}
