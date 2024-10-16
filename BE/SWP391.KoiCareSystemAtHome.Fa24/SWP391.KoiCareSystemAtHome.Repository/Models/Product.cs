using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class Product
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public string Title { get; set; } = null!;

    public string Url { get; set; } = null!;

    public string? Description { get; set; }

    public virtual Adv Post { get; set; } = null!;
}
