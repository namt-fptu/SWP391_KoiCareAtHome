using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.BusinessModels
{
    public class PaymentInformationModel
    {
        public string OrderType { get; set; }
        public decimal Amount { get; set; }
        public string OrderDescription { get; set; }
        public int PostId { get; set; }
        public int PackageId {  get; set; }
    }
}
