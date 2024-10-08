using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class Adv
{
    public int Id { get; set; }

    public int ShopId { get; set; }

    public string Title { get; set; } = null!;

    public string Url { get; set; } = null!;

    public DateTime AdvDate { get; set; }

    public bool Status { get; set; }

    public DateTime? EditedDate { get; set; }

    public DateTime ExpiredDate { get; set; }

    public int Duration { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual Shop Shop { get; set; } = null!;
}
