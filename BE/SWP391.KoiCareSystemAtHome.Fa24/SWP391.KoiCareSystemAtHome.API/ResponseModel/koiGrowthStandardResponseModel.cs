namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class koiGrowthStandardResponseModel
    {
        public int Id { get; set; }

        public string KoiVariety { get; set; } = null!;

        public int Stage { get; set; }

        public decimal MaxLength { get; set; }

        public decimal MinLength { get; set; }

        public decimal MaxWeigth { get; set; }

        public decimal MinWeigth { get; set; }

        public decimal MaxFeed { get; set; }

        public decimal MinFeed { get; set; }
    }
}
