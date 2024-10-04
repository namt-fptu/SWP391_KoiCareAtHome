using SWP391.KoiCareSystemAtHome.Repository;
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

        public async Task<IEnumerable<KoiFishModel>> GetKoiFishByPondIdAsync(int id)
        {
            var koiFishs = await _unitOfWork.KoiFishs.GetAsync();
            var fishOfPond = koiFishs.Where(f => f.PondId == id);

            if (fishOfPond.Any()) 
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
    }
}
