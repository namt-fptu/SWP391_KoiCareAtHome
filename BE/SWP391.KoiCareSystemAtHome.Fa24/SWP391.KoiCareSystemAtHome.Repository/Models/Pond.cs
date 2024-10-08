using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class Pond
{
    public int Id { get; set; }

    public int PondOwnerId { get; set; }

    public string Name { get; set; } = null!;

    public float Depth { get; set; }

    public double Volume { get; set; }

    public int? DraimCount { get; set; }

    public int? SkimmerCount { get; set; }

    public float? PumpingCapacity { get; set; }

    public virtual ICollection<KoiFish> KoiFishes { get; set; } = new List<KoiFish>();

    public virtual PondOwner PondOwner { get; set; } = null!;

    public virtual ICollection<WaterReport> WaterReports { get; set; } = new List<WaterReport>();
}
