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
    public class PaymentService
    {
        private readonly UnitOfWork _unitOfWork;

        public PaymentService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<PaymentModel>> GetPaymentByPostIdAsync(int id)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var paymentOfPost = payments.Where(pm => pm.PostId == id);

            if (!paymentOfPost.Any())
                return Enumerable.Empty<PaymentModel>();

            var paymentModels = paymentOfPost.Select(pm => new PaymentModel
            {
                Id = pm.Id,
                PostId = pm.PostId,
                PackageId = pm.PackageId,
                PayDate = pm.PayDate,
                Quantity = pm.Quantity,
                Duration = pm.Duration,
            });
            return paymentModels;
        }
        public async Task<IEnumerable<PaymentModel>> GetPaymentByPackageIdAsync(int id)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var paymentOfPackage = payments.Where(pm => pm.PackageId == id);

            if (!paymentOfPackage.Any())
                return Enumerable.Empty<PaymentModel>();

            var paymentModels = paymentOfPackage.Select(pm => new PaymentModel
            {
                Id = pm.Id,
                PostId = pm.PostId,
                PackageId = pm.PackageId,
                PayDate = pm.PayDate,
                Quantity = pm.Quantity,
                Duration = pm.Duration,
            });
            return paymentModels;
        }

        public async Task<PaymentModel> GetPaymentByIdAsync(int paymentId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var payment = payments.FirstOrDefault(pm => pm.Id == paymentId);

            if (payment == null)
                return null;

            var paymentModel = new PaymentModel
            {
                Id= payment.Id,
                PackageId= payment.PackageId,
                PostId= payment.PostId,
                PayDate = payment.PayDate,
                Quantity = payment.Quantity,
                Duration = payment.Duration,
            };
            return paymentModel;
        }

        public async Task<int> CreatePaymentAsync(PaymentModel paymentModel)
        {
            var paymentEntity = new Payment
            {
                PackageId = paymentModel.PackageId,
                PostId= paymentModel.PostId,
                PayDate = paymentModel.PayDate,
                Quantity = paymentModel.Quantity,
                Duration = paymentModel.Duration,
            };

            await _unitOfWork.Payments.InsertAsync(paymentEntity);
            await _unitOfWork.SaveAsync();

            return paymentEntity.Id;
        }

        public async Task<bool> UpdatePaymentAsync(int id, PaymentModel paymentModel)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var payment = payments.FirstOrDefault(pm => pm.Id == id);

            if (payment == null)
                return false;

            payment.PackageId = paymentModel.PackageId;
            payment.PostId = paymentModel.PostId;
            payment.PayDate = paymentModel.PayDate;
            payment.Quantity = paymentModel.Quantity;
            payment.Duration = paymentModel.Duration;

            _unitOfWork.Payments.UpdateAsync(payment);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var payment = await _unitOfWork.Payments.GetByIdAsync(id);

            if (payment == null)
                return false;

            _unitOfWork.Payments.DeleteAsync(payment);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeletePaymentByPostIdAsync(int postId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();

            var billOfPost = payments.Where(pm => pm.PostId == postId).ToList();

            if (!billOfPost.Any())
                return false;

            foreach (var pmEntity in billOfPost)
            {
                bool success = await DeletePaymentAsync(pmEntity.Id);
            }

            return true;
        }

        public async Task<bool> DeletePaymentByPackageIdAsync(int packageId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();

            var billOfPackage = payments.Where(pm => pm.PackageId == packageId).ToList();

            if (!billOfPackage.Any())
                return false;

            foreach (var pmEntity in billOfPackage)
            {
                bool success = await DeletePaymentAsync(pmEntity.Id);
            }

            return true;
        }

    }
}
