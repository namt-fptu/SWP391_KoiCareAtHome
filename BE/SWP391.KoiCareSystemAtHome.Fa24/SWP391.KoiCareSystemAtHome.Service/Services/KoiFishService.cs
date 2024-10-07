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
    public class KoiFishService
    {
        private readonly UnitOfWork _unitOfWork;

        public KoiFishService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<KoiFishModel>> GetKoiFishByPondIdAsync(int pondId)
        {
            var koiFishs = await _unitOfWork.KoiFishs.GetAsync();
            var fishOfPond = koiFishs.Where(f => f.PondId == pondId);

            if (fishOfPond == null || !fishOfPond.Any()) 
                return Enumerable.Empty<KoiFishModel>();

            var koiFishModels = fishOfPond.Select(fish => new KoiFishModel
            {
                Id = fish.Id,
                PondId = fish.PondId,
                KoiVariety = fish.KoiVariety,
                KoiName = fish.KoiName,
                Dob = fish.Dob,
                Sex = fish.Sex,
                Price = fish.Price,
                ImageUrl = fish.ImageUrl
            });

            return koiFishModels;
        }

        public async Task<KoiFishModel> GetKoiFishByIdAsync(int pondId, int fishId)
        {
            var koiFishs = await _unitOfWork.KoiFishs.GetAsync();
            var fishOfPond = koiFishs.Where(f => f.PondId == pondId);

            if (fishOfPond == null || !fishOfPond.Any())
                return null;

            var koiFish = fishOfPond.FirstOrDefault(f => f.Id == fishId);

            if (koiFish == null)
                return null;

            var koiFishModel = new KoiFishModel
            {
                Id = koiFish.Id,
                PondId = koiFish.PondId,
                KoiVariety = koiFish.KoiVariety,
                KoiName = koiFish.KoiName,
                Dob = koiFish.Dob,
                Sex = koiFish.Sex,
                Price = koiFish.Price,
                ImageUrl = koiFish.ImageUrl
            };
            return koiFishModel;
        }

        public async Task<int> CreateKoiFishAsync(KoiFishModel koiFishModel)
        {
            var entity = new KoiFish
            {
                PondId = koiFishModel.PondId,
                KoiVariety = koiFishModel.KoiVariety,
                KoiName = koiFishModel.KoiName,
                Dob = koiFishModel.Dob,
                Sex = koiFishModel.Sex,
                Price = koiFishModel.Price,
                ImageUrl = koiFishModel.ImageUrl
            };

            await _unitOfWork.KoiFishs.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Id;
        }

    }
}
