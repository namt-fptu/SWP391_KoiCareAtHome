using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("getPaymentByAdvId/{advId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseModel>>> GetPaymentByAdvId(int advId)
        {
            var payments = await _paymentService.GetPaymentByAdvIdAsync(advId);

            if (payments == null || !payments.Any())
                return NotFound();

            var response = payments.Select(x => new PaymentResponseModel
            {
                Id = x.Id,
                PackageId = x.PackageId,
                PostId = x.PostId,
                PayDate = x.PayDate,
                Description = x.Description,
                TransactionId = x.TransactionId,
                Success = x.Success,
                Token = x.Token,
            });

            return Ok(response);
        }

        [HttpGet("getPaymentByPaclageId/{packageId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseModel>>> GetPaymentByPackageId(int packageId)
        {
            var payments = await _paymentService.GetPaymentByPackageIdAsync(packageId);

            if (payments == null || !payments.Any())
                return NotFound();

            var response = payments.Select(x => new PaymentResponseModel
            {
                Id = x.Id,
                PackageId = x.PackageId,
                PostId = x.PostId,
                PayDate = x.PayDate,
                Description = x.Description,
                TransactionId = x.TransactionId,
                Success = x.Success,
                Token = x.Token,
            });

            return Ok(response);
        }

        [HttpGet("getPaymentByPaymentId/{paymentId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseModel>>> GetPaymentByPaymentId(int paymentId)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(paymentId);

            if (payment == null)
                return NotFound();

            var response = new PaymentResponseModel
            {
                Id = payment.Id,
                PackageId = payment.PackageId,
                PostId = payment.PostId,
                PayDate = payment.PayDate,
                Description = payment.Description,
                TransactionId = payment.TransactionId,
                Success = payment.Success,
                Token = payment.Token,
            };

            return Ok(response);
        }
    }
}
