﻿namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class KoiGrowthReportResponseModel
    {
        public int Id { get; set; }

        public int KoiId { get; set; }

        public int Stage { get; set; }

        public DateTime Date { get; set; }

        public decimal Length { get; set; }

        public decimal Weight { get; set; }
    }
}
