namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class AccountUpdateRequestModel
    {
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public string? Name { get; set; }

        public string? ShopUrl { get; set; }
    }
}
