namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class PostPackageRequestModel
    {
        public int PostPackageId { get; set; }

        public string Name { get; set; } = null!;

        public int Duration { get; set; }

        public decimal Price { get; set; }
    }
}
