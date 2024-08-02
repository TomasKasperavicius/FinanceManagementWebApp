using Dwolla.Client;
using Dwolla.Client.Models.Requests;
using Dwolla.Client.Models;
using Dwolla.Client.Models.Responses;

namespace webapi.Services
{
    public class DwollaService
    {
        private readonly DwollaClient _client;
        private readonly Headers _headers = new();
        public DwollaService(bool isSandbox)
        {
            _client = DwollaClient.Create(isSandbox: isSandbox);
        }
        public async Task<TokenResponse> SetBearerToken(string Key, string Secret)
        {
            var response = await _client.PostAuthAsync<TokenResponse>(
            new Uri($"{_client.ApiBaseAddress}/token"),
            new AppTokenRequest { Key = Key, Secret = Secret });

            if (!_headers.ContainsKey("Authorization"))
                _headers.Add("Authorization", $"Bearer {response.Content.Token}");
            else
                _headers["Authorization"] = $"Bearer {response.Content.Token}";

            return response.Content;
        }
        public async Task<Uri> CreateCustomerAsync(Models.CreateCustomerRequest createCustomerRequest)
        {
            var request = new CreateCustomerRequest
            {
                FirstName = createCustomerRequest.FirstName,
                LastName = createCustomerRequest.LastName,
                Email = createCustomerRequest.Email,
                DateOfBirth = new DateTime(2001, 1, 1),
                Address1 = "99-99 33rd St",
                City = "Test",
                State = "CA",
                Type = "personal",
                PostalCode = "50318",
                Ssn = "9899",
                IpAddress = "10.10.10.10"
            };

            var response = await _client.PostAsync<CreateCustomerRequest, EmptyResponse>(new Uri("https://api-sandbox.dwolla.com/customers"), request, _headers);
            return response.Response.Headers.Location;
        }

        public async Task<Uri> CreateFundingSourceAsync(Models.CreateFundingSourceRequest fundingSourceRequest)
        {
            var fundingSourceRequestWithoutUri = new
            {
                name = fundingSourceRequest.Name,
                plaidToken = fundingSourceRequest.PlaidToken
            };
            var response = await _client.PostAsync<object, EmptyResponse>(new Uri($"{fundingSourceRequest.Uri}/funding-sources"), fundingSourceRequestWithoutUri, _headers);

            if (response.Response.IsSuccessStatusCode)
            {
                return response.Response.Headers.Location;
            }
            return new Uri("null");
        }
        public async Task<Uri> CreateTransferAsync(Models.CreateTransferRequest transferRequest)
        {
            var transfer = new CreateTransferRequest
            {
                Links = new Dictionary<string, Link>
                {
                    { "source", new Link { Href = new Uri($"https://api-sandbox.dwolla.com/funding-sources/{transferRequest.SenderFundingSourceID}") } },
                    { "destination", new Link { Href = new Uri($"https://api-sandbox.dwolla.com/funding-sources/{transferRequest.ReceiverFundingSourceID}") } }
                },
                Amount = new Money
                {
                    Currency = "USD",
                    Value = transferRequest.Amount 
                }
            };
            try
            {
                var response = await _client.PostAsync<CreateTransferRequest, EmptyResponse>(new Uri("https://api-sandbox.dwolla.com/transfers"), transfer, _headers);
                
                if (response.Response.IsSuccessStatusCode)
                {
                    return response.Response.Headers.Location;
                }
                return new Uri("null");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return new Uri("null");
            }
        }
    }


}
