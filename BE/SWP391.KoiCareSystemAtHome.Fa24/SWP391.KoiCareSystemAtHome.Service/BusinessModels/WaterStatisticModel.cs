﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class WaterStatisticModel
    {
        public DateTime Date { get; set; }

        public decimal MaxTemp { get; set; }

        public decimal MinTemp { get; set; }

        public decimal MaxPh { get; set; }

        public decimal MinPh { get; set; }

        public decimal MaxHardness { get; set; }

        public decimal MinHardness { get; set; }

        public decimal MaxOxigen { get; set; }

        public decimal MinOxigen { get; set; }

        public decimal MaxCabondioxide { get; set; }

        public decimal MinCabondioxide { get; set; }

        public decimal MaxSalt { get; set; }

        public decimal MinSalt { get; set; }

        public decimal MaxNitrates { get; set; }

        public decimal MinNitrates { get; set; }

        public decimal MaxNitrite { get; set; }

        public decimal MinNitrite { get; set; }

        public decimal MaxAmonium { get; set; }

        public decimal MinAmonium { get; set; }

        //---------------

        public decimal Temperature { get; set; }

        public decimal PhVaule { get; set; }

        public decimal Hardness { get; set; }

        public decimal Oxigen { get; set; }

        public decimal Cabondioxide { get; set; }

        public decimal Salt { get; set; }

        public decimal? Nitrates { get; set; }

        public decimal? Nitrite { get; set; }

        public decimal? Amonium { get; set; }

    }
}
