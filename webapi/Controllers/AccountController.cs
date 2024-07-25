using Going.Plaid;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("account")]
    public class AccountController : Controller
    {
        private readonly FinanceDbContext _context;
        private readonly PlaidClient _plaidClient;

        public AccountController(FinanceDbContext context, PlaidClient plaidClient)
        {
            _context = context;
            _plaidClient = plaidClient;
        }

        [HttpPost("addAccounts")]
        public async Task<IActionResult> AddAccounts([FromBody] Account[] accountData)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == accountData[0].UserID);
                if (user == null)
                {
                    return NotFound("User doesn't exist.");
                }
                await _context.Accounts.AddRangeAsync(accountData);
                await _context.SaveChangesAsync();
                return Ok(accountData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
        [HttpPost("getAccounts")]
        public async Task<IActionResult> GetAccounts([FromBody] int UserID)
        {
            try
            {
                var uniqueAccessTokens = await _context.Accounts
              .Where(a => a.UserID == UserID)
              .Select(a => a.AccessToken)
              .Distinct()
              .ToListAsync();
                var allAccounts = new List<dynamic>();

                foreach (var accessToken in uniqueAccessTokens)
                {
                    var response = await _plaidClient.AccountsGetAsync(new()
                    {
                        AccessToken = accessToken
                    });
                    allAccounts.AddRange(response.Accounts.Select(account => new
                    {
                        Account = account,
                        AccessToken = accessToken
                    }));
                }
                return Ok(allAccounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}
