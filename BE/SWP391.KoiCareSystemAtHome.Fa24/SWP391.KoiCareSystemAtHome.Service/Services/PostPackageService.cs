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
        public async Task<PostPackageModel> GetPostPackageByIdAsync(int postPackageId)
        {
            var postPackages = await _unitOfWork.PostPackages.GetAsync();

            var postPackage = postPackages.FirstOrDefault(pp => pp.Id == postPackageId);

            if (postPackage == null)
                return null;

            var postPackageModel = new PostPackageModel
            {
                Id = postPackage.Id,
                Name = postPackage.Name,
                Price = postPackage.Price,
                Duration = postPackage.Duration,

            };
            return postPackageModel;
        }
        //public async Task<IEnumerable<PostPackageModel>> GetPostPackageByIdAsync(int id)
        //{
        //    var postPackages = await _unitOfWork.PostPackages.GetAsync();
        //    if (postPackages.Any())
        //        return Enumerable.Empty<PostPackageModel>();

        //    var postpakageModels = postPackages.Select(pp => new PostPackageModel
        //    {
        //        Id = pp.Id,
        //        Name = pp.Name,
        //        Duration = pp.Duration,
        //        Price = pp.Price,
        //    });
        //    return postpakageModels;
        //}

        //public async Task<PostPackageModel> GetPostPackageByIdAsync(int postPackageId)
        //{
        //    var postPackages = await _unitOfWork.PostPackages.GetAsync();

        //    var postPackage = postPackages.FirstOrDefault(pp => pp.Id == postPackageId);

        //    if (postPackage == null)
        //        return null;

        //    var postPackageModel = new PostPackageModel
        //    {
        //        Id = postPackage.Id,
        //        Name = postPackage.Name,
        //        Duration = postPackage.Duration,
        //        Price = postPackage.Price,
        //    };
        //    return postPackageModel;
        //}

        public async Task<int> CreatePostPackageAsync(PostPackageModel postPackageModel)
        {
            var postPackageEntity = new PostPackage
            {
                Id = postPackageModel.Id,
                Name = postPackageModel.Name,
                Duration = postPackageModel.Duration,
                Price = postPackageModel.Price,
            };

            await _unitOfWork.PostPackages.InsertAsync(postPackageEntity);
            await _unitOfWork.SaveAsync();

            return postPackageEntity.Id;
        }

        public async Task<bool> UpdatePostPackageAsync(int id, PostPackageModel postPackageModel)
        {
            var postPakages = await _unitOfWork.PostPackages.GetAsync();
            if (postPakages == null)
                return false;

            var postPakageToUpdate = postPakages.Where(x => x.Id == id).FirstOrDefault();
            if (postPakageToUpdate == null)
                return false;

            postPakageToUpdate.Name = postPackageModel.Name;
            postPakageToUpdate.Duration = postPackageModel.Duration;
            postPakageToUpdate.Price = postPackageModel.Price;

            _unitOfWork.PostPackages.UpdateAsync(postPakageToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePostPackageAsync(int id)
        {
            var postPakages = await _unitOfWork.PostPackages.GetAsync();
            if (postPakages == null)
                return false;

            var postPakageToUpdate = postPakages.Where(x => x.Id == id).FirstOrDefault();
            if (postPakageToUpdate == null)
                return false;

            _unitOfWork.PostPackages.DeleteAsync(postPakageToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
