using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class WaterParameterStandard
{
    public int Id { get; set; }

    public string KoiVariety { get; set; } = null!;

    public int Stage { get; set; }

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

    public virtual Koivariety KoiVarietyNavigation { get; set; } = null!;
}
