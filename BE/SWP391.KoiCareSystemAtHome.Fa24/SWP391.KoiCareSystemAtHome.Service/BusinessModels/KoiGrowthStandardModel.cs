using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class KoiGrowthStandardModel
    {
        public int Id { get; set; }

        public string KoiVariety { get; set; } = null!;

        public int Stage { get; set; }

        public decimal StandardLength { get; set; }

        public decimal StandardWeigth { get; set; }

        public decimal MaxFeed { get; set; }

        public decimal MinFeed { get; set; }
    }
}
