namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class PaymentRequestModel
    {
        public int PackageId { get; set; }

        public int PostId { get; set; }

        public DateTime PayDate { get; set; }

        public int Quantity { get; set; }

        public int Duration { get; set; }
    }
}
