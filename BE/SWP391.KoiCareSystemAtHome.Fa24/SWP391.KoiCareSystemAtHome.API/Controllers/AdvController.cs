using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvController : ControllerBase
    {
        private readonly AdvService _advService;

        public AdvController(AdvService advService)
        {
            _advService = advService;
        }

        [HttpGet("getAdvByShopId/{shopId}")]
        public async Task<ActionResult<IEnumerable<AdvResponseModel>>> GetAdvByShopId(int shopId)
        {
            var advs = await _advService.GetAdvByShopIdAsync(shopId);

            if (advs == null || !advs.Any())
                return NotFound();

            var response = advs.Select(a => new AdvResponseModel
            {
                Id = a.Id,
                ShopId = a.ShopId,
                Title = a.Title,
                Url = a.Url,
                AdvDate = a.AdvDate,
                Status = a.Status,
                EditedDate = a.EditedDate,
                ExpiredDate = a.ExpiredDate,
                Duration = a.Duration,
            });
            return Ok(response);
        }

        [HttpGet("GetAdvById/{advId}")]
        public async Task<ActionResult<AdvResponseModel>> GetAdvById(int advId)
        {
            var adv = await _advService.GetAdvByIdAsync(advId);

            if (adv == null)
                return NotFound();

            var response = new AdvResponseModel
            {
                Id = adv.Id,
                ShopId = adv.ShopId,
                Title = adv.Title,
                Url = adv.Url,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            };

            return Ok(response);
        }

        [HttpPost("createAdv")]
        public async Task<ActionResult> CreateAdv(AdvModel request)
        {
            if (request == null)
                return BadRequest("Adv data is required.");
            try
            {
                var advModdel = new AdvModel
                {
                    ShopId = request.ShopId,
                    Title = request.Title,
                    Url = request.Url,
                    AdvDate = request.AdvDate,
                    Status = request.Status,
                    EditedDate = request.EditedDate,
                    ExpiredDate = request.ExpiredDate,
                    Duration = request.Duration,

                };

                int advId = await _advService.CreateAdvAsync(advModdel);
                var adv = await _advService.GetAdvByIdAsync(advId);

                if (adv == null)
                    return NotFound();

                var response = new AdvResponseModel
                {
                    Id = adv.Id,
                    ShopId = adv.ShopId,
                    Title = adv.Title,
                    Url = adv.Url,
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the post.");
            }
        }

        [HttpPut("updateAdv/{advId}")]
        public async Task<ActionResult> UpdateAdv(int advId, AdvRequestModel advRequestModel)
        {
            AdvModel advModel = await _advService.GetAdvByIdAsync(advId);

            if (advModel == null)
                return NotFound();

            try
            {
                advModel.Title = advRequestModel.Title;
                advModel.Url = advRequestModel.Url;
                advModel.AdvDate = advRequestModel.AdvDate;
                advModel.Status = advRequestModel.Status;
                advModel.EditedDate = advRequestModel.EditedDate;
                advModel.ExpiredDate = advRequestModel.ExpiredDate;
                advModel.Duration = advRequestModel.Duration;

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
