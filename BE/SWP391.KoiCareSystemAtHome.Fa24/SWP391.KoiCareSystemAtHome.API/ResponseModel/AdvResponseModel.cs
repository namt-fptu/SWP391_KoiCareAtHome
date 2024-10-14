namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class AdvResponseModel
    {
        public int Id { get; set; }

        public int ShopId { get; set; }

        public string Title { get; set; } = null!;

        public string Url { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;

        public DateTime AdvDate { get; set; }

        public string Status { get; set; } = null!;

        public DateTime? EditedDate { get; set; }

        public DateTime ExpiredDate { get; set; }

        public int Duration { get; set; }
    }
}
