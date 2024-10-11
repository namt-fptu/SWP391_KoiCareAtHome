namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class PaymentResponseModel
    {
        public int Id { get; set; }

        public int PackageId { get; set; }

        public int PostId { get; set; }

        public DateTime PayDate { get; set; }

        public int Quantity { get; set; }

        public int Duration { get; set; }
    }
}
