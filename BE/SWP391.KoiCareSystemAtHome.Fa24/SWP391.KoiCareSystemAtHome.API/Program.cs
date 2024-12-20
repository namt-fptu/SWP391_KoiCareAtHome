
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Repository.Data;
//using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //SQL connection
            builder.Services.AddDbContext<Swp391koiCareSystemAtHomeContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            //add cors
            //builder.Services.AddCors(option =>
            //    option.AddPolicy("CORS", builder =>
            //        builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin()));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost",
                    policy =>
                    {
                        policy.WithOrigins("*")
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            }); ;

            //Add Swagger authentication
            builder.Services.AddSwaggerGen(option =>
            {
                option.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                });
                option.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8
                            .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });


            //add Scope
            builder.Services.AddScoped<UnitOfWork>();
            builder.Services.AddScoped<AccountService>();
            builder.Services.AddScoped<PondOwnerService>();
            builder.Services.AddScoped<ShopService>();
            builder.Services.AddScoped<PondService>();
            builder.Services.AddScoped<WaterReportService>();
            builder.Services.AddScoped<KoiFishService>();
            builder.Services.AddScoped<KoiGrowthReportService>();
            builder.Services.AddScoped<KoiVarietyService>();
            builder.Services.AddScoped<KoiGrowthStandardService>();
            builder.Services.AddScoped<WaterParameterStandardService>();
            builder.Services.AddScoped<PostPackageService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<AdvService>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<VnPayService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowLocalhost");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
