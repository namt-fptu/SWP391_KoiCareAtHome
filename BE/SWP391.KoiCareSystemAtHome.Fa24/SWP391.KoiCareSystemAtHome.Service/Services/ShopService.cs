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
    public class ShopService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly AdvService _advService;

        public ShopService(UnitOfWork unitOfWork, AdvService advService)
        {
            _unitOfWork = unitOfWork;
            _advService = advService;
        }

        public async Task<ShopModel?> GetShopModelByIdAsync(int id)
        {
            var acccount = await _unitOfWork.Accounts.GetByIdAsync(id);
            var shops = await _unitOfWork.Shops.GetAsync();

            if (acccount == null || shops == null)
                return null;

            var shop = shops.Where(x => x.ShopId == id).FirstOrDefault();
            if (shop == null)
                return null;

            return new ShopModel
            {
                ShopId = acccount.Id,
                Name = shop.Name,
                ShopUrl = shop.ShopUrl,
            };
        }

        public async Task<int> CreateShopAsync(ShopModel shopModel)
        {
            var shopEntity = new Shop
            {
                ShopId = shopModel.ShopId,
                Name = shopModel.Name,
                ShopUrl = shopModel.ShopUrl,
            };

            await _unitOfWork.Shops.InsertAsync(shopEntity);
            await _unitOfWork.SaveAsync();

            return shopEntity.ShopId;
        }

        public async Task<bool> UpdateShopAsync(int id, ShopModel shopModel)
        {
            var shops = await _unitOfWork.Shops.GetAsync();
            if (shops == null)
                return false;

            var shopToUpdate = shops.Where(x => x.ShopId == id).FirstOrDefault();
            if (shopToUpdate == null)
                return false;

            shopToUpdate.Name = shopModel.Name;
            shopToUpdate.ShopUrl = shopModel.ShopUrl;
            
            _unitOfWork.Shops.UpdateAsync(shopToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteShopAsync(int id)
        {
            //var shops = await _unitOfWork.Shops.GetAsync();
            //if (shops == null)
            //    return false;

            //var shopToUpdate = shops.Where(x => x.ShopId == id).FirstOrDefault();
            //if (shopToUpdate == null)
            //    return false;

            var shopToDelete = await _unitOfWork.Shops.GetByIdAsync(id);
            if (shopToDelete == null) 
                return false;

            await _advService.DeleteAdvsByShopIdAsync(id);

            _unitOfWork.Shops.DeleteAsync(shopToDelete);
            await _unitOfWork.SaveAsync();
            return true;
        }

    }
}
