using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class UpdateAdsModel
    {
        public int PackageId { get; set; }

        public int PostId { get; set; }

        public DateTime PayDate { get; set; }
    }
}
