using BookingCareApplication.Data;
using BookingCareApplication.Data.Interface;
using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;
using BookingCareApplication.helpers;
using BookingCareApplication.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<BookingcareContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<IClinicRepo, ClinicRepo>();

builder.Services.AddTransient<ISpecializationRepo, SpecializationRepo>();

builder.Services.AddTransient<IDoctorRepo, DoctorRepo>();

builder.Services.AddTransient<IScheduleRepo, ScheduleRepo>();

builder.Services.AddTransient<IUserRepo, UserRepo>();

builder.Services.AddTransient<IPatientRepo, PatientRepo>();

builder.Services.AddTransient<IMedicalRecordRepo, MedicalRecordRepo>();

builder.Services.AddTransient<IStatusRepo, StatusRepo>();

builder.Services.AddTransient<ILocationRepo, LocationRepo>();

builder.Services.AddTransient<ITitleRepo, TitleRepo>();

builder.Services.AddTransient<INotificationRepo, NotificationRepo>();

builder.Services.AddTransient<IUserRepo, UserRepo>();

builder.Services.AddTransient<IDoctor_ClinicRepo, Doctor_ClinicRepo>();


builder.Services.AddTransient<UserService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


IConfiguration configuration = builder.Configuration;
var appSettingsSection = configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);


var appSettings = appSettingsSection.Get<AppSettings>();
var key = Encoding.ASCII.GetBytes(appSettings.Secret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Thêm SwaggerFileOperationFilter vào Swagger
    c.OperationFilter<SwaggerFileOperationFilter>();
});


var app = builder.Build();

app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();

app.Run();
