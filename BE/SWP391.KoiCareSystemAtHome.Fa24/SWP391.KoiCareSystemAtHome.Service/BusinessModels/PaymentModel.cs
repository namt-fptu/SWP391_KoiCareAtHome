using System;
using System.Collections.Generic;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels;

public partial class PaymentModel
{
    public int Id { get; set; }

    public int PackageId { get; set; }

    public int PostId { get; set; }

    public DateTime PayDate { get; set; }

    public int Quantity { get; set; }

    public int Duration { get; set; }


}
