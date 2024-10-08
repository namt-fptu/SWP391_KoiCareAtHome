namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class KoiGrowthReportRequestModel
    {
        public int KoiId { get; set; }

        public DateTime Date { get; set; }

        public decimal Length { get; set; }

        public decimal Wetight { get; set; }
    }
}
