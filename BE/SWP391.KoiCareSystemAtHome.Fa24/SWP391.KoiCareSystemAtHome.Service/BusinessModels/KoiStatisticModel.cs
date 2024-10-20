using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class KoiStatisticModel
    {
        public int Stage { get; set; }

        public decimal MaxLength { get; set; }

        public decimal MinLength { get; set; }

        public decimal MaxWeigth { get; set; }

        public decimal MinWeigth { get; set; }

        public decimal Length { get; set; }

        public decimal Weight { get; set; }
    }
}
