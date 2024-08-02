namespace webapi.Models
{
    public class CreateTransferRequest
    {
        public string SenderFundingSourceID { get; set; }
        public string ReceiverFundingSourceID { get; set; }
        public decimal Amount { get; set; }
    }
}
