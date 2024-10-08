using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class Shop
{
    public int ShopId { get; set; }

    public string ShopUrl { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<Adv> Advs { get; set; } = new List<Adv>();

    public virtual Account ShopNavigation { get; set; } = null!;
}
