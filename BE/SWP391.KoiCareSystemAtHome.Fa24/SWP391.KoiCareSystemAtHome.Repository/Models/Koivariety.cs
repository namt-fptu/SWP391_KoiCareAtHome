using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class Koivariety
{
    public string Variety { get; set; } = null!;

    public string? Rarity { get; set; }

    public string? Color { get; set; }

    public virtual ICollection<KoiFish> KoiFishes { get; set; } = new List<KoiFish>();

    public virtual ICollection<KoiGrowthStandard> KoiGrowthStandards { get; set; } = new List<KoiGrowthStandard>();

    public virtual ICollection<WaterParameterStandard> WaterParameterStandards { get; set; } = new List<WaterParameterStandard>();
}
