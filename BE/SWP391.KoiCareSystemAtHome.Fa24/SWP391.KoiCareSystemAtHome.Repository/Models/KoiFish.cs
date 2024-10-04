using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class KoiFish
{
    public int Id { get; set; }

    public int PondId { get; set; }

    public string KoiVariety { get; set; } = null!;

    public string KoiName { get; set; } = null!;

    public DateTime? Dob { get; set; }

    public string Sex { get; set; } = null!;

    public decimal? Price { get; set; }

    public string ImageUrl { get; set; } = null!;

    public virtual ICollection<KoiGrowthReport> KoiGrowthReports { get; set; } = new List<KoiGrowthReport>();

    public virtual Koivariety KoiVarietyNavigation { get; set; } = null!;

    public virtual Pond Pond { get; set; } = null!;
}
