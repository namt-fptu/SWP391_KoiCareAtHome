using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using System.Data.SqlTypes;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class AdvService
    {
        private readonly UnitOfWork _unitOfWork;

        public AdvService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<AdvModel>> GetAdvByShopIdAsync(int shopId)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            var advOfShop = advs.Where(a => a.ShopId == shopId);

            if (!advOfShop.Any() || advOfShop == null)
                return Enumerable.Empty<AdvModel>();

            var advModels = advOfShop.Select(a => new AdvModel
            {
                Id = a.Id,
                Title = a.Title,
                Url = a.Url,
                ImageUrl = a.ImageUrl,
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
            var adv = await _unitOfWork.Advs.GetByIdAsync(advId);

            if (adv == null)
                return null;

            var advModel = new AdvModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                ImageUrl = adv.ImageUrl,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            };
            return advModel;
        }

        public async Task<bool> CheckAdvExistAsync(int advId)
        {
            var adv = await _unitOfWork.Advs.GetByIdAsync(advId);

            if (adv == null)
                return false;

            return true;
        }

        public async Task<int> CreateAdvAsync(AdvModel advModel)
        {
            var advEntity = new Adv
            {
                ShopId = advModel.ShopId,
                Title = advModel.Title,
                Url = advModel.Url,
                ImageUrl = advModel.ImageUrl,
                AdvDate = DateTime.Now,
                Status = "Expired",
                EditedDate = DateTime.Now,
                ExpiredDate = (DateTime)SqlDateTime.MinValue,
                Duration = 0,
            };

            await _unitOfWork.Advs.InsertAsync(advEntity);
            await _unitOfWork.SaveAsync();

            return advEntity.Id;
        }

        public async Task<bool> UpdateAdvAsync(int id, AdvModel advModel)
        {

            var advToUpdate = await _unitOfWork.Advs.GetByIdAsync(id);

            if (advToUpdate == null)
                return false;

            advToUpdate.Title = advModel.Title;
            advToUpdate.Url = advModel.Url;
            advToUpdate.ImageUrl = advModel.ImageUrl;
            //advToUpdate.AdvDate = advModel.AdvDate;
            //advToUpdate.Status = advModel.Status;
            advToUpdate.EditedDate = DateTime.Now;
            //advToUpdate.ExpiredDate = advModel.ExpiredDate;
            //advToUpdate.Duration = advModel.Duration;

            _unitOfWork.Advs.UpdateAsync(advToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<AdvModel>> GetAdvByStatusAsync(string status)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            var advFilltered = advs.Where(a => a.Status == status);

            if (advFilltered == null || !advFilltered.Any())
                return Enumerable.Empty<AdvModel>();

            var advModels = advFilltered.Select(adv => new AdvModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                ImageUrl = adv.ImageUrl,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            });
            return advModels;
        }

        public async Task<IEnumerable<AdvModel>> GetApprovedAdvAsync()
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            var advFilltered = advs.Where(a => a.Status == "Approved");

            if (advFilltered == null || !advFilltered.Any())
                return Enumerable.Empty<AdvModel>();

            var advModels = advFilltered.Select(adv => new AdvModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                ImageUrl = adv.ImageUrl,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            });
            return advModels;
        }

        private void CheckExpriedAdv()
        {

        }

    }
}
