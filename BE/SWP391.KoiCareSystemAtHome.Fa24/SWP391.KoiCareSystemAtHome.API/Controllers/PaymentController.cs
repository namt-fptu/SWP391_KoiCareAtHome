using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
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
        [HttpGet("post/{postId}")]
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

        [HttpGet("package/{packageId}")]
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

        [HttpGet("paymentId/{paymentId}")]
        public async Task<ActionResult<PaymentResponseModel>> GetPaymentById(int paymentId)
        {

            var payment = await _paymentService.GetPaymentByIdAsync(paymentId);

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

        [HttpPost("createPayment")]
        public async Task<ActionResult> CreatePayment(PaymentRequestModel request)
        {
            if (request == null)
                return BadRequest("Payment data is required.");
            try
            {
                var paymentModdel = new PaymentModel
                {
                    PackageId = request.PackageId,
                    PostId = request.PostId,
                    PayDate = request.PayDate,
                    Quantity = request.Quantity,
                    Duration = request.Duration,

                };

                int paymentId = await _paymentService.CreatePaymentAsync(paymentModdel);
                var payment = await _paymentService.GetPaymentByIdAsync(paymentId);

                if (payment == null)
                    return NotFound();

                var response = new PaymentResponseModel
                {
                    Id= payment.Id,
                    PackageId= payment.PackageId,
                    PostId= payment.PostId,
                    PayDate= payment.PayDate,
                    Quantity = payment.Quantity,
                    Duration = payment.Duration,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpPut("updatePayment/{paymentId}")]
        public async Task<ActionResult> UpdatePayment(int paymentId, PaymentRequestModel paymentRequestModel)
        {
            PaymentModel paymentModel = await _paymentService.GetPaymentByIdAsync(paymentId);

            if (paymentModel == null)
                return NotFound();

            try
            {
                paymentModel.PackageId = paymentRequestModel.PackageId;
                paymentModel.PostId = paymentRequestModel.PostId;
                paymentModel.PayDate = paymentRequestModel.PayDate;
                paymentRequestModel.Quantity = paymentModel.Quantity;
                paymentRequestModel.Duration = paymentModel.Duration;

                bool success = await _paymentService.UpdatePaymentAsync(paymentId, paymentModel);

                if (!success)
                    return NotFound();

                var payment = await _paymentService.GetPaymentByIdAsync(paymentId);

                if (payment == null)
                    return NotFound();

                var response = new PaymentResponseModel
                {
                    Id = payment.Id,
                    PackageId = payment.PackageId,
                    PostId = payment.PostId,
                    PayDate = payment.PayDate,
                    Quantity = payment.Quantity,
                    Duration = payment.Duration,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpDelete("deletePayment/{paymentId}")]
        public async Task<ActionResult> DeleteAdv(int paymentId)
        {
            bool success = await _paymentService.DeletePaymentAsync(paymentId);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
