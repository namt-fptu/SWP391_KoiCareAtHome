using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels;

public partial class ProductModel
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public string Title { get; set; } = null!;

    public string Url { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;

    public string? Description { get; set; }
}
