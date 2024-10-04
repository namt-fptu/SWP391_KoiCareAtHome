namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class AccountResponseModel
    {
        public int Id { get; set; }

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public string Role { get; set; } = null!;
    }
}
