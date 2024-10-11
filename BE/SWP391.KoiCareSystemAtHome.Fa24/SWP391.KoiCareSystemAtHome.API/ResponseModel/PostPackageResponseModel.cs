namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class PostPackageResponseModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int Duration { get; set; }

        public decimal Price { get; set; }
    }
}
