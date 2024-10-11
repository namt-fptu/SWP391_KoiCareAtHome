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
                Id = advModel.Id,

            };

            await _unitOfWork.Advs.InsertAsync(advEntity);
            await _unitOfWork.SaveAsync();

            return advEntity.Id;
        }

        public async Task<bool> UpdateAdvAsync(int id, AdvModel advModel)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            if (advs == null)
                return false;

            var advToUpdate = advs.Where(x => x.Id == id).FirstOrDefault();
            if (advToUpdate == null)
                return false;

            advToUpdate.Title = advModel.Title;
            advToUpdate.Url = advModel.Url;
            advToUpdate.AdvDate = advModel.AdvDate;
            advToUpdate.Status = advModel.Status;
            advToUpdate.EditedDate = advModel.EditedDate;
            advToUpdate.ExpiredDate = advModel.ExpiredDate;
            advToUpdate.Duration = advModel.Duration;

            _unitOfWork.Advs.UpdateAsync(advToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteAdvAsync(int id)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            if (advs == null)
                return false;

            var advToUpdate = advs.Where(a => a.Id == id).FirstOrDefault();
            if (advToUpdate == null)
                return false;

            _unitOfWork.Advs.DeleteAsync(advToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
