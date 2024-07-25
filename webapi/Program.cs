using Going.Plaid;
using Microsoft.EntityFrameworkCore;
using webapi;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddControllers();
builder.Services.AddDbContext<FinanceDbContext>(options => options.UseMySql(System.Environment.GetEnvironmentVariable("MySQL_CONNECTION_STRING"), new MySqlServerVersion(new Version(8, 0, 31))));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.Configure<PlaidOptions>(options =>
{
    options.ClientId = System.Environment.GetEnvironmentVariable("PLAID_CLIENT_ID");
    options.Secret = System.Environment.GetEnvironmentVariable("PLAID_SECRET");
    options.Environment = Going.Plaid.Environment.Sandbox;
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
