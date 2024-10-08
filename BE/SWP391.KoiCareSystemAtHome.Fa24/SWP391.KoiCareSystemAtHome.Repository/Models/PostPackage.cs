using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class PostPackage
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Duration { get; set; }

    public decimal Price { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
