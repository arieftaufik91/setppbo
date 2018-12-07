using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SETPPBO.DAO;
using System.Threading.Tasks;
using SETPPBO.Filters;
using SETPPBO.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Linq;
using System.Security.Claims;

namespace SETPPBO
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

            services.AddCors();
            services.AddDbContext<CoreDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<MainDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("MainConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<CoreDbContext>()
                .AddDefaultTokenProviders();

            // set status code 401 when cookie expired and call api, otherwise redirect to login
            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    if (!context.Request.Path.StartsWithSegments("/api"))
                    {
                        context.Response.Redirect(context.RedirectUri);
                    } else
                    {
                        context.Response.StatusCode = 401;
                    }

                    //return Task.CompletedTask;
                    return Task.FromResult(0);
                };
            });

            services.AddAuthentication().AddKemenkeuID(options =>
            {
                options.ClientId = Configuration["Authentication:KemenkeuID:ClientId"];
                options.ClientSecret = Configuration["Authentication:KemenkeuID:ClientSecret"];
                options.SaveTokens = true;
            });

            services.AddMvc(config =>
            {
                config.Filters.Add(new CustomActionFilter());
            }).AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
                app.UseDatabaseErrorPage();
                using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    //migrate system data
                    serviceScope.ServiceProvider.GetService<CoreDbContext>().Database.Migrate();
                    //migrate sample data
                    serviceScope.ServiceProvider.GetService<MainDbContext>().Database.Migrate();
                }
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );
            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
                routes.MapRoute(
                    name: "areas",
                    template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
