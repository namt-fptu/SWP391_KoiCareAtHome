using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class KoiGrowthStandard
{
    public int Id { get; set; }

    public string KoiVariety { get; set; } = null!;

    public int Stage { get; set; }

    public decimal StandardLength { get; set; }

    public decimal StandardWeigth { get; set; }

    public decimal MaxFeed { get; set; }

    public decimal MinFeed { get; set; }

    public virtual Koivariety KoiVarietyNavigation { get; set; } = null!;
}
