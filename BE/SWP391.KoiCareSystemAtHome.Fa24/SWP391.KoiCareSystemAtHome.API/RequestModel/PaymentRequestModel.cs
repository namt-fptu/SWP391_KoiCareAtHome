namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class PaymentRequestModel
    {
        public string OrderType { get; set; }
        public string OrderDescription { get; set; }
        public int PostId { get; set; }
        public int PackageId { get; set; }
    }
}
