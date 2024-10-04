namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class ShopResponseModel
    {
        public int ShopId { get; set; }

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public string Role { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Url { get; set; } = null!;
    }
}
