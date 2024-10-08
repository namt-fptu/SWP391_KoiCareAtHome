namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class AccountRequetModel
    {
        //public int Id { get; set; }

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public string Role { get; set; } = null!;

        public string? Name { get; set; }

        public string? ShopUrl { get; set; }
    }
}
