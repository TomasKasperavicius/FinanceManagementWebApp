using Going.Plaid;
using Microsoft.EntityFrameworkCore;
using webapi;
using webapi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers();
builder.Services.AddDbContext<FinanceDbContext>(options => options.UseMySql(System.Environment.GetEnvironmentVariable("MySQL_CONNECTION_STRING"), new MySqlServerVersion(new Version(8, 0, 31))));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string? DWOLLA_KEY = System.Environment.GetEnvironmentVariable("DWOLLA_KEY");
string? DWOLLA_SECRET = System.Environment.GetEnvironmentVariable("DWOLLA_SECRET");
if (string.IsNullOrEmpty(DWOLLA_KEY) || string.IsNullOrEmpty(DWOLLA_SECRET))
{
    throw new ArgumentNullException(nameof(DWOLLA_KEY), nameof(DWOLLA_SECRET));
}

string? PLAID_CLIENT_ID = System.Environment.GetEnvironmentVariable("PLAID_CLIENT_ID");
string? PLAID_SECRET = System.Environment.GetEnvironmentVariable("PLAID_SECRET");
if (string.IsNullOrEmpty(PLAID_CLIENT_ID) || string.IsNullOrEmpty(PLAID_SECRET))
{
    throw new ArgumentNullException(nameof(PLAID_CLIENT_ID), nameof(PLAID_SECRET));
}

builder.Services.Configure<PlaidOptions>(options =>
{
    options.ClientId = PLAID_CLIENT_ID;
    options.Secret = PLAID_SECRET;
    options.Environment = Going.Plaid.Environment.Sandbox;
});



builder.Services.AddSingleton<DwollaService>(_ =>
{
    DwollaService dwollaService = new DwollaService(true);
    Task.Run(async () => await dwollaService.SetBearerToken(DWOLLA_KEY, DWOLLA_SECRET)).Wait();
    return dwollaService;
});

builder.Services.AddPlaid(builder.Configuration);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigins",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(policy => policy
    .WithOrigins("https://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapControllers();



app.Run();
