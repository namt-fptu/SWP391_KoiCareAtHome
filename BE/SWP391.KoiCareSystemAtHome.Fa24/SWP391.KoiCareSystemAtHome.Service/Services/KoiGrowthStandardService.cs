using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class KoiGrowthStandardService
    {
        private readonly UnitOfWork _unitOfWork;

        public KoiGrowthStandardService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<KoiGrowthStandardModel>> GetAllKoiGrowthStandardsAsync()
        {
            var koiGrowthStandards = await _unitOfWork.KoiGrowthStandards.GetAsync();

            if (koiGrowthStandards == null || !koiGrowthStandards.Any())
                return Enumerable.Empty<KoiGrowthStandardModel>();

            var koiGrowthStandardModels = koiGrowthStandards.Select(g => new KoiGrowthStandardModel
            {
                Id = g.Id,
                KoiVariety = g.KoiVariety,
                Stage = g.Stage,
                StandardLength = g.StandardLength,
                StandardWeigth = g.StandardWeigth,
                MaxFeed = g.MaxFeed,
                MinFeed = g.MinFeed
            });

            return koiGrowthStandardModels;
        }

        public async Task<KoiGrowthStandardModel> KoiGrowthStandardModelAsync(string variety)
        {
            var koiGrowthStandards = await _unitOfWork.KoiGrowthStandards.GetAsync();

            if (koiGrowthStandards == null || !koiGrowthStandards.Any())
                return null;

            var koiGrowthStandard = koiGrowthStandards.Where(g => g.KoiVariety.ToLower().Equals(variety.ToLower())).FirstOrDefault();

            if (koiGrowthStandard == null)
                return null;

            var koiGrowthStandardModel = new KoiGrowthStandardModel
            {
                Id = koiGrowthStandard.Id,
                KoiVariety = koiGrowthStandard.KoiVariety,
                Stage = koiGrowthStandard.Stage,
                StandardLength = koiGrowthStandard.StandardLength,
                StandardWeigth = koiGrowthStandard.StandardWeigth,
                MaxFeed = koiGrowthStandard.MaxFeed,
                MinFeed = koiGrowthStandard.MinFeed
            };

            return koiGrowthStandardModel;
        }
    }
}
