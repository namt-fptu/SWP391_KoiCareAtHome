using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class KoiGrowthReport
{
    public int Id { get; set; }

    public int KoiId { get; set; }

    public DateTime Date { get; set; }

    public decimal Length { get; set; }

    public decimal Wetight { get; set; }

    public virtual KoiFish Koi { get; set; } = null!;
}
