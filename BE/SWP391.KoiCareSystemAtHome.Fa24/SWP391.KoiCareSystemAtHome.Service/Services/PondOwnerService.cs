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
    public class PondOwnerService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly PondService _pondService;

        public PondOwnerService(UnitOfWork unitOfWork, PondService pondService)
        {
            _unitOfWork = unitOfWork;
            _pondService = pondService;
        }

        public async Task<PondOwnerModel?> GetPondOwnerByIdAsync(int id)
        {
            var account = await _unitOfWork.Accounts.GetByIdAsync(id);
            var pondOwners = await _unitOfWork.PondOwners.GetAsync();

            if (account == null || pondOwners == null)
                return null;

            var pondOwner = pondOwners.Where(x => x.PondOwnerId == id).FirstOrDefault();

            return new PondOwnerModel
            {
                Role = account.Role,
                PondOwnerId = pondOwner.PondOwnerId,
                Name = pondOwner.Name,
            };
        }

        public async Task<int> CreatePondOwnerAsync(PondOwnerModel ownerModel)
        {
            var ownerEntity = new PondOwner
            {
                PondOwnerId = ownerModel.PondOwnerId,
                Name = ownerModel.Name,
            };
            await _unitOfWork.PondOwners.InsertAsync(ownerEntity);
            await _unitOfWork.SaveAsync();

            return ownerEntity.PondOwnerId;
        }

        public async Task<bool> UpdatePondOwnerAsync(int id, PondOwnerModel ownerModel)
        {
            var pondOwners = await _unitOfWork.PondOwners.GetAsync();
            if (pondOwners == null)
                return false;

            var pondOwnerToUpdate = pondOwners.Where(x => x.PondOwnerId == id).FirstOrDefault();
            if (pondOwnerToUpdate == null)
                return false;

            pondOwnerToUpdate.Name = ownerModel.Name;
            
            _unitOfWork.PondOwners.UpdateAsync(pondOwnerToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePondOwnerAsync(int id)
        {
            //var pondOwners = await _unitOfWork.PondOwners.GetAsync();
            //if (pondOwners == null)
            //    return false;

            //var pondOwnerToDelete = pondOwners.Where(x => x.PondOwnerId == id).FirstOrDefault();
            //if (pondOwnerToDelete == null)
            //    return false;

            var pondOwnerToDelete = await _unitOfWork.PondOwners.GetByIdAsync(id);
            if (pondOwnerToDelete == null)
                return false;

            bool success = await _pondService.DeletePondByOwnerIdAsync(id);

            _unitOfWork.PondOwners.DeleteAsync(pondOwnerToDelete);
            await _unitOfWork.SaveAsync();
            return true;
        }

    }
}
