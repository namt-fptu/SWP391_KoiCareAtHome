using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Repository.Models;
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
                MaxLength = g.MaxLength,
                MinLength = g.MinLength,
                MaxWeigth = g.MaxWeigth,
                MinWeigth = g.MinWeigth,
                MaxFeed = g.MaxFeed,
                MinFeed = g.MinFeed
            });

            return koiGrowthStandardModels;
        }

        public async Task<KoiGrowthStandardModel> GetKoiGrowthStandardModelAsync(int id)
        {
            var koiGrowthStandards = await _unitOfWork.KoiGrowthStandards.GetAsync();

            if (koiGrowthStandards == null || !koiGrowthStandards.Any())
                return null;

            var koiGrowthStandard = koiGrowthStandards.FirstOrDefault(g => g.Id == id);

            if (koiGrowthStandard == null)
                return null;

            var koiGrowthStandardModel = new KoiGrowthStandardModel
            {
                Id = koiGrowthStandard.Id,
                KoiVariety = koiGrowthStandard.KoiVariety,
                Stage = koiGrowthStandard.Stage,
                MaxLength = koiGrowthStandard.MaxLength,
                MinLength = koiGrowthStandard.MinLength,
                MaxWeigth = koiGrowthStandard.MaxWeigth,
                MinWeigth = koiGrowthStandard.MinWeigth,
                MaxFeed = koiGrowthStandard.MaxFeed,
                MinFeed = koiGrowthStandard.MinFeed
            };

            return koiGrowthStandardModel;
        }

        public async Task<int> CreateKoiGrowthStandardAsync(KoiGrowthStandardModel koiGrowthStandardModel)
        {
            var entity = new KoiGrowthStandard
            {
                KoiVariety = koiGrowthStandardModel.KoiVariety,
                Stage = koiGrowthStandardModel.Stage,
                MaxLength = koiGrowthStandardModel.MaxLength,
                MinLength = koiGrowthStandardModel.MinLength,
                MaxWeigth = koiGrowthStandardModel.MaxWeigth,
                MinWeigth = koiGrowthStandardModel.MinWeigth,
                MaxFeed = koiGrowthStandardModel.MaxFeed,
                MinFeed = koiGrowthStandardModel.MinFeed
            };

            await _unitOfWork.KoiGrowthStandards.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateKoiGrowthStandardAsync(int id, KoiGrowthStandardModel koiGrowthStandardModel)
        {
            var koiGrowthStandars = await _unitOfWork.KoiGrowthStandards.GetAsync();
            var koiGrowthStandar = koiGrowthStandars.FirstOrDefault(g => g.Id == id);
            if (koiGrowthStandar == null)
                return false;

            koiGrowthStandar.Stage = koiGrowthStandardModel.Stage;
            koiGrowthStandar.MaxLength = koiGrowthStandardModel.MaxLength;
            koiGrowthStandar.MinLength = koiGrowthStandardModel.MinLength;
            koiGrowthStandar.MaxWeigth = koiGrowthStandardModel.MaxWeigth;
            koiGrowthStandar.MinWeigth = koiGrowthStandardModel.MinWeigth;
            koiGrowthStandar.MaxFeed = koiGrowthStandardModel.MaxFeed;
            koiGrowthStandar.MinFeed = koiGrowthStandardModel.MinFeed;

            _unitOfWork.KoiGrowthStandards.UpdateAsync(koiGrowthStandar);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteKoiGrowthStandardAsync(int id)
        {
            var koiGrowthStandard = await _unitOfWork.KoiGrowthStandards.GetByIdAsync(id);

            if (koiGrowthStandard == null)
                return false;

            _unitOfWork.KoiGrowthStandards.DeleteAsync(koiGrowthStandard);
            await _unitOfWork.SaveAsync();

            return true;
        }

    }
}
