using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class WaterReportModel
    {
        public int Id { get; set; }

        public int PondId { get; set; }

        public decimal Temperature { get; set; }

        public decimal PhVaule { get; set; }

        public decimal Hardness { get; set; }

        public decimal Oxigen { get; set; }

        public decimal Cabondioxide { get; set; }

        public decimal Salt { get; set; }

        public DateTime Date { get; set; }

        public decimal? Nitrates { get; set; }

        public decimal? Nitrite { get; set; }

        public decimal? Amonium { get; set; }
    }
}
