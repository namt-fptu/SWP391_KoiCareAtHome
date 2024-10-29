namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class ChangePasswordRequestModel
    {
        public string OldPassword { get; set; } = null!;

        public string NewPassword { get; set; } = null!;

        public string ConfirmPassword { get; set; } = null!;

    }
}
