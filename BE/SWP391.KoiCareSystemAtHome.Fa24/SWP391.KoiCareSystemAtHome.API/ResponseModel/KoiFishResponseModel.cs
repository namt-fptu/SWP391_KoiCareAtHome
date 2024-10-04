namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class KoiFishResponseModel
    {
        public int Id { get; set; }

        public int PondId { get; set; }

        public string KoiVariety { get; set; } = null!;

        public string KoiName { get; set; } = null!;

        public DateTime? Dob { get; set; }

        public string Sex { get; set; } = null!;

        public decimal? Price { get; set; }

        public string ImageUrl { get; set; } = null!;
    }
}
