namespace webapi.Models
{
    public class Transaction
    {
        public int TransactionID { get; set; }
        public decimal Amount { get; set; }
        public int SenderBankID { get; set; }
        public int ReceiverBankID { get; set; }
        public string Name { get; set; }
        public string PaymentChannel { get; set; }

        public string Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
