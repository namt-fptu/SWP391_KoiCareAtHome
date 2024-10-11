using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels;

public partial class PostPackageModel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Duration { get; set; }

    public decimal Price { get; set; }
}
