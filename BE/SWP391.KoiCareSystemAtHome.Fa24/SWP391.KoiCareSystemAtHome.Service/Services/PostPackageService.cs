using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Intrinsics.Arm;


namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class PostPackageService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly PaymentService _paymentService;

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
            var packages = await _unitOfWork.PostPackages.GetAsync();
            var postPackage = packages.FirstOrDefault(pp => pp.Id == id);

            if (postPackage == null)
                return false;

            postPackage.Name = postPackageModel.Name;
            postPackage.Duration = postPackageModel.Duration;
            postPackage.Price = postPackageModel.Price;

            _unitOfWork.PostPackages.UpdateAsync(postPackage);
            await _unitOfWork.SaveAsync();


            return true;
        }

        public async Task<bool> DeletePostPackageAsync(int id)
        {
            var package = await _unitOfWork.PostPackages.GetByIdAsync(id);

            if (package == null)
                return false;

            //bool deletePayment = false;
            //deletePayment = await _paymentService.DeletePaymentByPackageIdAsync(id);

            _unitOfWork.PostPackages.DeleteAsync(package);
            await _unitOfWork.SaveAsync();

            return true;
        }
    }
}
