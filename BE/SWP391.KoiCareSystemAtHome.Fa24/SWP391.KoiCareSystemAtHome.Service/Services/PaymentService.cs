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

            if (paymentOfPost.Any())
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
            var paymentOfPost = payments.Where(pm => pm.PackageId == id);

            if (paymentOfPost.Any())
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

        public async Task<PaymentModel> GetPaymentByIdAsync(int paymentId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var payment = payments.FirstOrDefault(a => a.Id == paymentId);

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
                Id = paymentModel.Id,
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
            if (payments == null)
                return false;

            var paymentToUpdate = payments.Where(x => x.Id == id).FirstOrDefault();
            if (paymentToUpdate == null)
                return false;

            paymentToUpdate.PayDate = paymentModel.PayDate;
            paymentToUpdate.Quantity = paymentModel.Quantity;
            paymentToUpdate.Duration = paymentModel.Duration;

            _unitOfWork.Payments.UpdateAsync(paymentToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            if (payments == null)
                return false;

            var paymentToUpdate = payments.Where(x => x.Id == id).FirstOrDefault();
            if (paymentToUpdate == null)
                return false;

            _unitOfWork.Payments.DeleteAsync(paymentToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
