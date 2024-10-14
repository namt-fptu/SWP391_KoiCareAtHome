using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
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

        public async Task<IEnumerable<PaymentModel>> GetPaymentByPackageIdAsync(int packegeId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var fillteredPayments = payments.Where(p => p.PackageId == packegeId);

            if (fillteredPayments == null || !fillteredPayments.Any()) 
                return Enumerable.Empty<PaymentModel>();

            var pamentModels = fillteredPayments.Select(p => new PaymentModel
            {
                Id = p.Id,
                PackageId = p.PackageId,
                PostId = p.PostId,
                PayDate = p.PayDate,
                Description = p.Description,
                TransactionId = p.TransactionId,
                Success = p.Success,
                Token = p.Token
            });

            return pamentModels;
        }

        public async Task<IEnumerable<PaymentModel>> GetPaymentByAdvIdAsync(int advId)
        {
            var payments = await _unitOfWork.Payments.GetAsync();
            var fillteredPayments = payments.Where(p => p.PostId == advId);

            if (fillteredPayments == null || !fillteredPayments.Any())
                return Enumerable.Empty<PaymentModel>();

            var pamentModels = fillteredPayments.Select(p => new PaymentModel
            {
                Id = p.Id,
                PackageId = p.PackageId,
                PostId = p.PostId,
                PayDate = p.PayDate,
                Description = p.Description,
                TransactionId = p.TransactionId,
                Success = p.Success,
                Token = p.Token
            });

            return pamentModels;
        }

        public async Task<PaymentModel> GetPaymentByIdAsync(int paymentID)
        {
            var payment = await _unitOfWork.Payments.GetByIdAsync(paymentID);

            if (payment == null)
                return null;

            var pamentModel = new PaymentModel
            {
                Id = payment.Id,
                PackageId = payment.PackageId,
                PostId = payment.PostId,
                PayDate = payment.PayDate,
                Description = payment.Description,
                TransactionId = payment.TransactionId,
                Success = payment.Success,
                Token = payment.Token
            };

            return pamentModel;
        }

    }
}
