using Going.Plaid;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : Controller
    {
        private readonly FinanceDbContext _context;
        private readonly PlaidClient _plaidClient;

        public UserController(FinanceDbContext financeDbContext, PlaidClient plaidClient, ILogger<UserController> logger)
        {
            _context = financeDbContext;
            _plaidClient = plaidClient;

        }

        [HttpPost("get_access_token")]
        public async Task<IActionResult> GetAccessToken([FromBody] PublicTokenRequest request)
        {
            try
            {
                var response = await _plaidClient.ItemPublicTokenExchangeAsync(new()
                {
                    PublicToken = request.PublicToken
                });

                return Ok(new { access_token = response.AccessToken, item_id = response.ItemId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost("create_link_token")]
        public async Task<IActionResult> CreateLinkToken([FromBody] string userID)
        {
            var request = new Going.Plaid.Link.LinkTokenCreateRequest
            {
                ClientName = "FinPlan",
                User = new Going.Plaid.Entity.LinkTokenCreateRequestUser
                {
                    ClientUserId = userID
                },
                Products = new[] { Going.Plaid.Entity.Products.Auth, Going.Plaid.Entity.Products.Transactions },
                CountryCodes = new[] { Going.Plaid.Entity.CountryCode.Us },
                Language = Going.Plaid.Entity.Language.English
            };

            var response = await _plaidClient.LinkTokenCreateAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return Ok(new { link_token = response.LinkToken });
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.Error);
            }
        }
        [HttpPost("accounts")]
        public async Task<IActionResult> GetAccounts([FromBody] AccessTokenRequest request)
        {
            try
            {
                var response = await _plaidClient.AccountsGetAsync(new()
                {
                    AccessToken = request.AccessToken
                });
                return Ok(response.Accounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost("transactions")]
        public async Task<IActionResult> GetTransactions([FromBody] AccessTokenRequest request)
        {
            try
            {
                var response = await _plaidClient.TransactionsGetAsync(new()
                {
                    AccessToken = request.AccessToken,
                    StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-24)),
                    EndDate = DateOnly.FromDateTime(DateTime.UtcNow),
                });
                return Ok(response.Transactions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        
    }

    public class PublicTokenRequest
    {
        public string PublicToken { get; set; }
    }

    public class AccessTokenRequest
    {
        public string AccessToken { get; set; }
    }

}
