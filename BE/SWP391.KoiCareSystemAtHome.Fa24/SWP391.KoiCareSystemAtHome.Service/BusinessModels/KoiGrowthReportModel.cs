using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class KoiGrowthReportModel
    {
        public int Id { get; set; }

        public int KoiId { get; set; }

        public int Stage { get; set; }

        public DateTime Date { get; set; }

        public decimal Length { get; set; }

        public decimal Wetight { get; set; }
    }
}
