namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class PondRequestModel
    {
        public int PondOwnerId { get; set; }

        public string Name { get; set; } = null!;

        public float Depth { get; set; }

        public double Volume { get; set; }

        public int? DraimCount { get; set; }

        public int? SkimmerCount { get; set; }

        public float? PumpingCapacity { get; set; }
    }
}
