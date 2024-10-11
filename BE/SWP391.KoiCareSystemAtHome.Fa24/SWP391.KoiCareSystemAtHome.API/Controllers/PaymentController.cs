using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391_KoiManagement.API.Controllers
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
        [HttpGet("payment/{postId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseModel>>> GetPaymentByPostId(int postId)
        {
            var payments = await _paymentService.GetPaymentByPostIdAsync(postId);

            if (payments == null || !payments.Any())
                return NotFound();

            var response = payments.Select(pm => new PaymentResponseModel
            {
                Id = pm.Id,
                PostId = pm.PostId,
                PackageId = pm.PackageId,
                PayDate = pm.PayDate,
                Quantity = pm.Quantity,
                Duration = pm.Duration,
            });
            return Ok(response);
        }

        [HttpGet("payment/{packageId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseModel>>> GetPaymentByPackageId(int packageId)
        {
            var payments = await _paymentService.GetPaymentByPackageIdAsync(packageId);

            if (payments == null || !payments.Any())
                return NotFound();

            var response = payments.Select(pm => new PaymentResponseModel
            {
                Id = pm.Id,
                PostId = pm.PostId,
                PackageId = pm.PackageId,
                PayDate = pm.PayDate,
                Quantity = pm.Quantity,
                Duration = pm.Duration,
            });
            return Ok(response);
        }

        [HttpPost("payment")]
        public async Task<ActionResult<PaymentResponseModel>> GetPaymentByPostId(PaymentRequestModel request)
        {
            var payments = await _paymentService.GetPaymentByPostIdAsync(request.PostId);

            if (payments == null || !payments.Any())
                return NotFound();

            var payment = payments.Where(k => k.Id == request.PaymentId).FirstOrDefault();
            if (payment == null)
                return NotFound();

            var response = new PaymentResponseModel
            {
                Id = payment.Id,
                PostId = payment.PostId,
                PackageId = payment.PackageId,
                PayDate = payment.PayDate,
                Quantity = payment.Quantity,
                Duration = payment.Duration,
            };

            return Ok(response);
        }

    }
}
