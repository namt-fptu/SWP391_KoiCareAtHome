using System.ComponentModel.DataAnnotations;

namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class AuthenticateRequestModel
    {
        [Required]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
    }
}
