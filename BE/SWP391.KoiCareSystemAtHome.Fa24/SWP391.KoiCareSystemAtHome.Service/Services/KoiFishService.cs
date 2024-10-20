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
        private readonly KoiGrowthReportService _koiGrowthReportService;

        public KoiFishService(UnitOfWork unitOfWork, KoiGrowthReportService koiGrowthReportService)
        {
            _unitOfWork = unitOfWork;
            _koiGrowthReportService = koiGrowthReportService;
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

        public async Task<KoiFishModel> GetKoiFishByIdAsync(int fishId)
        {
            var koiFishs = await _unitOfWork.KoiFishs.GetAsync();

            var koiFish = koiFishs.FirstOrDefault(f => f.Id == fishId);

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

        public async Task<bool> UpdateKoiFishAsync(int fishId, KoiFishModel koiFishModel)
        {
            var fishs = await _unitOfWork.KoiFishs.GetAsync();
            var fish = fishs.FirstOrDefault(f => f.Id == fishId);

            if (fish == null) 
                return false;

            fish.KoiName = koiFishModel.KoiName;
            fish.Dob = koiFishModel.Dob;
            fish.Sex = koiFishModel.Sex;
            fish.Price = koiFishModel.Price;
            fish.ImageUrl = koiFishModel.ImageUrl;

            _unitOfWork.KoiFishs.UpdateAsync(fish);
            await _unitOfWork.SaveAsync();


            return true;
        }

        public async Task<bool> DeleteKoiFishAsync(int fishId)
        {
            var koiFish = await _unitOfWork.KoiFishs.GetByIdAsync(fishId);

            if (koiFish == null)
                return false;

            bool deleteKoiGrowthReport = false;
            deleteKoiGrowthReport = await _koiGrowthReportService.DeleteKoiGrowthReportAsync(fishId);

            //if (!deleteKoiGrowthReport)
            //    return false;

            _unitOfWork.KoiFishs.DeleteAsync(koiFish);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteKoiByPondIdAsync(int pondId)
        {
            var koiFishs = await _unitOfWork.KoiFishs.GetAsync();

            var fillteredFishs = koiFishs.Where(f => f.PondId == pondId).ToList();

            if (!fillteredFishs.Any())
                return false;

            foreach (var entity in fillteredFishs)
            {
                bool success = await DeleteKoiFishAsync(entity.Id);
                //if(!success)
                //    return false;
            }

            return true;
        }

        public async Task<decimal> GetTotalWeighOfKoisInPondAsync(int pondId)
        {
            var koiFish = await _unitOfWork.KoiFishs.GetAsync();
            var fishOfPond = koiFish.Where(f => f.PondId == pondId);
            var fishReports = await _unitOfWork.KoiGrowthReports.GetAsync();

            if (fishOfPond == null || !fishOfPond.Any())
                return 0;

            decimal totalWeigh = 0;
            foreach (var entity in fishOfPond)
            {
                var reportOfFish = fishReports.LastOrDefault(r => r.KoiId == entity.Id);
                if (reportOfFish == null) 
                    continue;

                totalWeigh += reportOfFish.Wetight;
            }

            return totalWeigh;
        }

    }
}
