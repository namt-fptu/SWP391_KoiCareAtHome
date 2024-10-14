namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class ProductResponseModel
    {
        public int Id { get; set; }

        public int PostId { get; set; }

        public string Title { get; set; } = null!;

        public string Url { get; set; } = null!;

        public string? Description { get; set; }
    }
}
