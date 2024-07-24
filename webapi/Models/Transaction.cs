namespace webapi.Models
{
    public class Transaction
    {
        public int AccountID { get; set; }
        public int TransactionID { get; set; }
        public decimal Amount { get; set; }
        public string Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
