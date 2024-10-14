using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class AdvService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly PaymentService _paymentService;

        public AdvService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<AdvModel>> GetAdvByShopIdAsync(int shopId)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            var advOfPost = advs.Where(a => a.ShopId == shopId);

            if (!advOfPost.Any() || advOfPost == null)
                return Enumerable.Empty<AdvModel>();

            var advModels = advOfPost.Select(a => new AdvModel
            {
                Id = a.Id,
                Title = a.Title,
                Url = a.Url,
                AdvDate = a.AdvDate,
                Status = a.Status,
                EditedDate = a.EditedDate,
                ExpiredDate = a.ExpiredDate,
                Duration = a.Duration,

            });
            return advModels;
        }

        public async Task<AdvModel> GetAdvByIdAsync(int advId)
        {
            var advs = await _unitOfWork.Advs.GetAsync();

            var adv = advs.FirstOrDefault(a => a.Id == advId);

            if (adv == null)
                return null;

            var advModel = new AdvModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            };
            return advModel;
        }
        public async Task<int> CreateAdvAsync(AdvModel advModel)
        {
            var advEntity = new Adv
            {
                ShopId = advModel.ShopId,
                Title = advModel.Title,
                Url = advModel.Url,
                Status = advModel.Status,
                AdvDate = advModel.AdvDate,
                EditedDate = advModel.EditedDate,
                ExpiredDate = advModel.ExpiredDate,
                Duration = advModel.Duration,
            };

            await _unitOfWork.Advs.InsertAsync(advEntity);
            await _unitOfWork.SaveAsync();

            return advEntity.Id;
        }

        public async Task<bool> UpdateAdvAsync(int advId, AdvModel advModel)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            var adv = advs.FirstOrDefault(a => a.Id == advId);

            if (adv == null)
                return false;

            adv.ShopId = advModel.ShopId;
            adv.Title = advModel.Title;
            adv.Url = advModel.Url;
            adv.AdvDate = advModel.AdvDate;
            adv.Status = advModel.Status;
            adv.EditedDate = advModel.EditedDate;
            adv.ExpiredDate = advModel.ExpiredDate;
            adv.Duration = advModel.Duration;

            _unitOfWork.Advs.UpdateAsync(adv);
            await _unitOfWork.SaveAsync();


            return true;
        }

        public async Task<bool> DeleteAdvAsync(int advId)
        {
            var adv = await _unitOfWork.Advs.GetByIdAsync(advId);

            if (adv == null)
                return false;

            //bool deletePayment = false;
            //deletePayment = await _paymentService.DeletePaymentByPostIdAsync(advId);

            _unitOfWork.Advs.DeleteAsync(adv);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteAdvByShopIdAsync(int shopId)
        {
            var advs = await _unitOfWork.Advs.GetAsync();

            var advsByShop = advs.Where(abs => abs.ShopId == shopId).ToList();

            if (!advsByShop.Any())
                return false;

            foreach (var adventity in advsByShop)
            {
                bool success = await DeleteAdvAsync(adventity.Id);
            }

            return true;
        }
    }
}
