using Going.Plaid;
using Going.Plaid.Processor;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Models;
using webapi.Services;

namespace webapi.Controllers
{
    [ApiController]
    [Route("account")]
    public class AccountController : Controller
    {
        private readonly FinanceDbContext _context;
        private readonly PlaidClient _plaidClient;
        private readonly DwollaService _dwollaService;
        public AccountController(FinanceDbContext context, PlaidClient plaidClient, DwollaService dwollaService)
        {
            _context = context;
            _plaidClient = plaidClient;
            _dwollaService = dwollaService;
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
              .Select(a => new { a.AccessToken, a.InstitutionID })
              .Distinct()
              .ToListAsync();
                var allAccounts = new List<dynamic>();

                foreach (var item in uniqueAccessTokens)
                {
                    var response = await _plaidClient.AccountsGetAsync(new()
                    {
                        AccessToken = item.AccessToken,

                    });
                    allAccounts.AddRange(response.Accounts.Select(account => new
                    {
                        Account = account,
                        AccessToken = item.AccessToken,
                        InstitutionID = item.InstitutionID
                    }));
                }
                return Ok(allAccounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
        [HttpPost("get_institution_by_id")]
        public async Task<IActionResult> GetInstitutionByID([FromBody] InstitutionRequest institutionRequest)
        {
            var request = new Going.Plaid.Institutions.InstitutionsGetByIdRequest
            {
                InstitutionId = institutionRequest.InstitutionID,
                CountryCodes = new[] { Going.Plaid.Entity.CountryCode.Us },
            };

            var response = await _plaidClient.InstitutionsGetByIdAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return Ok(new { institution = response.Institution });
            }
            else
            {
                return StatusCode((int)response.StatusCode, response.Error);
            }
        }
        [HttpPost("create_dwolla_processor_token")]
        public async Task<IActionResult> CreateProcessorToken([FromBody] ProcessorTokenRequest request)
        {
            var processorRequest = new ProcessorTokenCreateRequest
            {
                AccessToken = request.AccessToken,
                AccountId = request.AccountID,
                Processor = Going.Plaid.Entity.ProcessorTokenCreateRequestProcessorEnum.Dwolla
            };
            var processorResponse = await _plaidClient.ProcessorTokenCreateAsync(processorRequest);
            await Console.Out.WriteLineAsync(processorResponse.ToString());
            if (processorResponse.Error != null)
            {
                return BadRequest(processorResponse.Error);
            }

            return Ok(new { processor_token = processorResponse.ProcessorToken });
        }
        [HttpPost("create_dwolla_customer")]
        public async Task<IActionResult> CreateDwollaCustomer([FromBody] Models.CreateCustomerRequest request)
        {
           
            var uri = await _dwollaService.CreateCustomerAsync(request);
            return Ok(new { link = uri });
        }
        [HttpPost("create_funding_source")]
        public async Task<IActionResult> CreateFundingSource([FromBody] Models.CreateFundingSourceRequest request)
        {

            var uri = await _dwollaService.CreateFundingSourceAsync(request);
            return Ok(new { link = uri });
        }
        [HttpPost("create_transfer")]
        public async Task<IActionResult> CreateTransfer([FromBody] Models.CreateTransferRequest request)
        {

            var uri = await _dwollaService.CreateTransferAsync(request);
            return Ok(new { link = uri });
        }
    }
    public class ProcessorTokenRequest
    {
        public string AccessToken { get; set; }
        public string AccountID { get; set; }
    }
    public class InstitutionRequest { 
        public string AccessToken { get; set; }
        public string InstitutionID { get; set; }
    }
   
}
