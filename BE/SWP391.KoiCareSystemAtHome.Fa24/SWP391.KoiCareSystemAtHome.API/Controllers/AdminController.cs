using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdvService _advService;

        public AdminController(AdvService advService)
        {
            _advService = advService;
        }

        [HttpGet("getAdvByStatus/{status}")]
        public async Task<ActionResult> GetAdvByStatus(string status)
        {
            var adv = await _advService.GetAdvByStatusAsync(status);

            if (adv == null)
                return NotFound();

            var response = new AdvResponseModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                ImageUrl = adv.ImageUrl,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            };

            return Ok(response);
        }

        [HttpPut("updateAdv/{advId}")]
        public async Task<ActionResult> UpdateAdvStatus(int advId, string status)
        {
            AdvModel advModel = await _advService.GetAdvByIdAsync(advId);

            if (advModel == null)
                return NotFound();

            try
            {
                advModel.Status = status;

                bool success = await _advService.UpdateAdvAsync(advId, advModel);

                if (!success)
                    return NotFound();

                var adv = await _advService.GetAdvByIdAsync(advId);

                if (adv == null)
                    return NotFound();

                var response = new AdvResponseModel
                {
                    Id = adv.Id,
                    ShopId = adv.ShopId,
                    Title = adv.Title,
                    Url = adv.Url,
                    ImageUrl = adv.ImageUrl,
                    AdvDate = adv.AdvDate,
                    Status = adv.Status,
                    EditedDate = adv.EditedDate,
                    ExpiredDate = adv.ExpiredDate,
                    Duration = adv.Duration,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the post.");
            }
        }

    }
}
