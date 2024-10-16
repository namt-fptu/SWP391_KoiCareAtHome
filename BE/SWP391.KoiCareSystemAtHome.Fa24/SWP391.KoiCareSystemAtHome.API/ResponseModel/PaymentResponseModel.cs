namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class PaymentResponseModel
    {
        public int Id { get; set; }

        public int PackageId { get; set; }

        public int PostId { get; set; }

        public DateTime PayDate { get; set; }

        public string Description { get; set; } = null!;

        public int TransactionId { get; set; }

        public bool Success { get; set; }

        public string Token { get; set; } = null!;
    }
}
