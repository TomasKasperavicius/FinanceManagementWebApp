namespace webapi.Models
{
    public class CreateFundingSourceRequest
    {
        public string Uri { get; set; }
        public string Name { get; set; }
        public string BankType { get; set; }
        public string AccountNumber { get; set; }
        public string RoutingNumber { get; set; }
        public string PlaidToken { get; set; }
        
    }
}
