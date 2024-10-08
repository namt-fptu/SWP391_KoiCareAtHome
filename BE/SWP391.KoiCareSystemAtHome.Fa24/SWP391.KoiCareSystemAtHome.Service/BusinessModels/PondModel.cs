using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class PondModel
    {
        public int Id { get; set; }

        public int PondOwnerId { get; set; }

        public string Name { get; set; } = null!;

        public float Depth { get; set; }

        public double Volume { get; set; }

        public int? DraimCount { get; set; }

        public int? SkimmerCount { get; set; }

        public float? PumpingCapacity { get; set; }

        public List<KoiFish> KoiFishs { get; set; } = new List<KoiFish>();

        public List<WaterReport> WaterParameters { get; set; } = new List<WaterReport> { };
    }
}
