using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class PondOwnerModel
    {
        //public int Id { get; set; }

        //public string Email { get; set; } = null!;

        //public string Password { get; set; } = null!;

        //public string? Phone { get; set; }

        public string Role { get; set; } = null!;

        public int PondOwnerId { get; set; }

        public string Name { get; set; } = null!;

        public List<PondModel> Ponds { get; set; } = new List<PondModel>();
    }
}
