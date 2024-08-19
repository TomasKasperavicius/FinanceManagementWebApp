using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : Controller
    {
        private readonly FinanceDbContext _context;

        public AuthController(FinanceDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);
                if (user == null)
                {
                    return NotFound("User with this email doesn't exist.");
                }
                if (user.Password != login.Password)
                {
                    return Unauthorized("Wrong email or password.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegister register)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == register.Email || u.UserName == register.UserName);
                if (user != null)
                {
                    return BadRequest("User with this email or username already exists.");
                }
                var newUser = new User
                {
                    Email = register.Email,
                    Password = register.Password,
                    UserName = register.UserName,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
