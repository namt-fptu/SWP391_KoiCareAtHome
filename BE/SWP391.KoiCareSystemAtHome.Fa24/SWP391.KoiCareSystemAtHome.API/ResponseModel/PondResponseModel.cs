namespace SWP391.KoiCareSystemAtHome.API.ResponseModel
{
    public class PondResponseModel
    {
        public int Id { get; set; }

        public int PondOwnerId { get; set; }

        public string Name { get; set; } = null!;

        public float Depth { get; set; }

        public double Volume { get; set; }

        public int? DrainCount { get; set; }

        public int? SkimmerCount { get; set; }

        public float? PumpingCapacity { get; set; }
    }
}
