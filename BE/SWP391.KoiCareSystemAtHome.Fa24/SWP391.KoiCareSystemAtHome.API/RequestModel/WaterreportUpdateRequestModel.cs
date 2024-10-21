namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class WaterreportUpdateRequestModel
    {
        public decimal Temperature { get; set; }

        public decimal PhVaule { get; set; }

        public decimal Hardness { get; set; }

        public decimal Oxigen { get; set; }

        public decimal Cabondioxide { get; set; }

        public decimal Salt { get; set; }

        public DateTime Date { get; set; }

        public decimal? Nitrates { get; set; }

        public decimal? Nitrite { get; set; }

        public decimal? Amonium { get; set; }
    }
}
