using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        private readonly VnPayService _vpnPayService;
        private readonly PostPackageService _postPackageService;
        private readonly AdvService _advService;

        public PaymentController(PaymentService paymentService, VnPayService vpnPayService, PostPackageService postPackageService, AdvService advService)
        {
            _paymentService = paymentService;
            _vpnPayService = vpnPayService;
            _postPackageService = postPackageService;
            _advService = advService;
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

        [HttpGet("getPaymentByPacKageId/{packageId}")]
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

        [HttpPost("createPaymentURL")]
        public async Task<ActionResult> CreatePaymentURL(PaymentInformationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool checkAdv = await _advService.CheckAdvExistAsync(model.PostId);
            bool checkPackage = await _postPackageService.CheckPostPackageExistAsync(model.PackageId);

            if (!checkAdv || !checkPackage)
            {
                return NotFound("Advertisement or package not found!");
            }

            string url = _vpnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(url);
        }

        [HttpGet("paymentCallBack")]
        public async Task<ActionResult> PaymentCallBack()
        {
            if (!Request.Query.Any())
            {
                return BadRequest("Missing query parameters");
            }

            try
            {
                var response = _vpnPayService.PaymentExecute(Request.Query);

                string[] splitDescription = response.OrderDescription.Split(" ");

                var paymentModel = new PaymentModel
                {
                    PackageId = int.Parse(splitDescription[1]),
                    PostId = int.Parse(splitDescription[0]),
                    Description = response.OrderDescription,
                    PayDate = DateTime.Now,
                    TransactionId = int.Parse(response.TransactionId),
                    Success = response.Success,
                    Token = response.Token,
                };

                var advModel = new UpdateAdsModel
                {
                    PackageId = int.Parse(splitDescription[1]),
                    PostId = int.Parse(splitDescription[0]),
                    PayDate = DateTime.Now,
                };

                //bool success = false;

                //Console.WriteLine(paymentModel.PackageId + " " + paymentModel.PostId );

                if (response.Success)
                {
                    //success = await _paymentService.CreatePaymentAsync(paymentModel);
                    await _paymentService.CreatePaymentAsync(paymentModel);
                    await _advService.UpdateAdsPaymentAsync(advModel);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception (using a logging framework)
                return StatusCode(500, "An error occurred while processing the payment");
            }
        }

    }
}
