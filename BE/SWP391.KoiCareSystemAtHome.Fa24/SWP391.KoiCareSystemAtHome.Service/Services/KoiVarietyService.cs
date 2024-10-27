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
    public class KoiVarietyService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly WaterParameterStandardService _waterParameterStandardService;
        private readonly KoiGrowthStandardService _growthParameterStandardService;

        public KoiVarietyService(UnitOfWork unitOfWork, WaterParameterStandardService waterParameterStandardService, KoiGrowthStandardService growthParameterStandardService)
        {
            _unitOfWork = unitOfWork;
            _growthParameterStandardService = growthParameterStandardService;
            _waterParameterStandardService = waterParameterStandardService;
        }

        public async Task<IEnumerable<KoiVarietyModel>> GetAllKoiVarietyAsync()
        {
            var koiVarietys = await _unitOfWork.KoiVarietys.GetAsync();

            if (!koiVarietys.Any()) 
                return Enumerable.Empty<KoiVarietyModel>();

            var koiVarietyModels = koiVarietys.Select(k => new KoiVarietyModel
            {
                Variety = k.Variety,
                Color = k.Color,
                Rarity = k.Rarity
            });

            return koiVarietyModels;
        }

        public async Task<KoiVarietyModel?> GetKoiVarietyAsync(string variety)
        {
            var koiVariety = await _unitOfWork.KoiVarietys.GetByIdAsync(variety);

            if (koiVariety == null)
                return null;

            var koiVarietyModel = new KoiVarietyModel
            {
                Variety = koiVariety.Variety,
                Color = koiVariety.Color,
                Rarity = koiVariety.Rarity
            };
            return koiVarietyModel;
        }

        public async Task<string> CreateKoiVarietyAsync(KoiVarietyModel koiVarietyModel)
        {
            var entity = new Koivariety
            {
                Variety = koiVarietyModel.Variety,
                Rarity = koiVarietyModel.Rarity,
                Color = koiVarietyModel.Color,
            };

            await _unitOfWork.KoiVarietys.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Variety;
        }

        public async Task<bool> UpdateKoiVarietyAsync(string variety, KoiVarietyModel koiVarietyModel)
        {
            var koiVariety = await _unitOfWork.KoiVarietys.GetByIdAsync(variety);

            if (koiVariety == null) 
                return false;

            koiVariety.Rarity = koiVarietyModel.Rarity;
            koiVariety.Color = koiVarietyModel.Color;

            _unitOfWork.KoiVarietys.UpdateAsync(koiVariety);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteKoiVarietyAsync(string variety)
        {
            var koiVariety = await _unitOfWork.KoiVarietys.GetByIdAsync(variety);

            if (koiVariety == null)
                return false;

            await _waterParameterStandardService.DeleteWaterStandardByVarietyAsync(variety);
            await _growthParameterStandardService.DeleteKoiGrowthStandardByVarietyAsync(variety);
            _unitOfWork.KoiVarietys.DeleteAsync(koiVariety);

            await _unitOfWork.SaveAsync();
            return true;
        }

    }
}
