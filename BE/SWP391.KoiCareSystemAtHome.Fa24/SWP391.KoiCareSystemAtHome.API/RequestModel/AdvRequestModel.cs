﻿namespace SWP391.KoiCareSystemAtHome.API.RequestModel
{
    public class AdvRequestModel
    {
        public int ShopId { get; set; }

        public string Title { get; set; } = null!;

        public string Url { get; set; } = null!;

        public DateTime AdvDate { get; set; }

        public bool Status { get; set; }

        public DateTime? EditedDate { get; set; }

        public DateTime ExpiredDate { get; set; }

        public int Duration { get; set; }

    }
}
