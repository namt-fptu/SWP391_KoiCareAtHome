using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Repository.Models;

public partial class PondOwner
{
    public int PondOwnerId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Account PondOwnerNavigation { get; set; } = null!;

    public virtual ICollection<Pond> Ponds { get; set; } = new List<Pond>();
}
