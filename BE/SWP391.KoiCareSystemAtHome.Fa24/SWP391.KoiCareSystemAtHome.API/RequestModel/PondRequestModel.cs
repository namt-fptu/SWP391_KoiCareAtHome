﻿namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class PondRequestModel
    {
        public int PondOwnerId { get; set; }

        public string Name { get; set; } = null!;

        public float Depth { get; set; }

        public double Volume { get; set; }

        public int? DrainCount { get; set; }

        public int? SkimmerCount { get; set; }

        public string ImageUrl { get; set; } = null!;

        public float? PumpingCapacity { get; set; }
    }
}
