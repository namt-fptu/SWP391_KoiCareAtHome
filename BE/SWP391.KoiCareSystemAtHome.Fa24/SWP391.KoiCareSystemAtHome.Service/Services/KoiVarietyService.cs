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

        public KoiVarietyService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<KoiVarietyModel>> GetAllKoiVarietyAsync()
        {
            var koiVarietys = await _unitOfWork.KoiVarietys.GetAsync();

            if (!koiVarietys.Any()) 
                return Enumerable.Empty<KoiVarietyModel>();

            var koiVarietysModel = koiVarietys.Select(k => new KoiVarietyModel
            {
                Variety = k.Variety,
                Color = k.Color,
                Rarity = k.Rarity
            });

            return koiVarietysModel;
        }

        public async Task<KoiVarietyModel> GetKoiVarietyAsync(string variety)
        {
            var koiVarietys = await _unitOfWork.KoiVarietys.GetAsync();

            if (!koiVarietys.Any())
                return null;

            var koiVariety = koiVarietys.FirstOrDefault(k => k.Variety.Equals(variety, StringComparison.OrdinalIgnoreCase));

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

    }
}
