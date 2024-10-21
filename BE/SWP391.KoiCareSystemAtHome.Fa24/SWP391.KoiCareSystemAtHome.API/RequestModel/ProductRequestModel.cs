namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class ProductRequestModel
    {
        public int PostId { get; set; }

        public string Title { get; set; } = null!;

        public string Url { get; set; } = null!;

        public string? Description { get; set; }
    }
}
