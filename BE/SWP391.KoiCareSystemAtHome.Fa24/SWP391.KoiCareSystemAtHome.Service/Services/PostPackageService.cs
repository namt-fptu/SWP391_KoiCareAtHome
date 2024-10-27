using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class PostPackageService
    {
        private readonly UnitOfWork _unitOfWork;

        public PostPackageService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<PostPackageModel>> GetPostPackageAsync()
        {
            var postPackages = await _unitOfWork.PostPackages.GetAsync();

            if (postPackages == null || !postPackages.Any())
                return Enumerable.Empty<PostPackageModel>();

            var postpakageModels = postPackages.Select(pp => new PostPackageModel
            {
                Id = pp.Id,
                Name = pp.Name,
                Duration = pp.Duration,
                Price = pp.Price,
            });

            return postpakageModels;
        }

        public async Task<PostPackageModel?> GetPostPackageByIdAsync(int id)
        {
            var postPackage = await _unitOfWork.PostPackages.GetByIdAsync(id);

            if (postPackage == null)
                return null;

            var postpakageModel = new PostPackageModel
            {
                Id = postPackage.Id,
                Name = postPackage.Name,
                Duration = postPackage.Duration,
                Price = postPackage.Price,
            };

            return postpakageModel;
        }

        public async Task<bool> DeletePostPackage(int id)
        {
            var package = await _unitOfWork.PostPackages.GetByIdAsync(id);
            if (package == null)
                return false;

            _unitOfWork.PostPackages.DeleteAsync(package);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> CheckPostPackageExistAsync(int id)
        {
            var postPackage = await _unitOfWork.PostPackages.GetByIdAsync(id);

            if (postPackage == null)
                return false;

            return true;
        }

        public async Task<int> CreatePostPackageAsync(PostPackageModel postPackageModel)
        {
            var postPackageEntity = new PostPackage
            {
                Name = postPackageModel.Name,
                Duration = postPackageModel.Duration,
                Price = postPackageModel.Price,
            };

            await _unitOfWork.PostPackages.InsertAsync(postPackageEntity);
            await _unitOfWork.SaveAsync();

            return postPackageEntity.Id;
        }

        public async Task<bool> UpdatePostPakageAsync(int id, PostPackageModel postPackageModel)
        {

            var postPakageToUpdate = await _unitOfWork.PostPackages.GetByIdAsync(id);
            if (postPakageToUpdate == null)
                return false;

            postPakageToUpdate.Name = postPackageModel.Name;
            postPakageToUpdate.Duration = postPackageModel.Duration;
            postPakageToUpdate.Price = postPackageModel.Price;

            _unitOfWork.PostPackages.UpdateAsync(postPakageToUpdate);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeletePostPakageAsync(int id)
        {
            var postPakageToDelete = await _unitOfWork.PostPackages.GetByIdAsync(id);
            if (postPakageToDelete == null)
                return false;

            _unitOfWork.PostPackages.DeleteAsync(postPakageToDelete);
            await _unitOfWork.SaveAsync();

            return true;
        }
    }
}
