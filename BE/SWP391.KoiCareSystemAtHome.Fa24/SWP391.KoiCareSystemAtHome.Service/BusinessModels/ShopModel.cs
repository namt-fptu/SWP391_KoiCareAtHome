using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class ShopModel
    {
        public int ShopId { get; set; }

        //public string Email { get; set; } = null!;

        //public string Password { get; set; } = null!;

        //public string? Phone { get; set; }

        public string Role { get; set; } = null!;
        
        public string ShopUrl { get; set; } = null!;

        public string Name { get; set; } = null!;
    }
}
