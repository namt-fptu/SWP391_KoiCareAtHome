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
                ImageUrl = a.ImageUrl,
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
                ImageUrl = adv.ImageUrl,
                AdvDate = adv.AdvDate,
                Status = adv.Status,
                EditedDate = adv.EditedDate,
                ExpiredDate = adv.ExpiredDate,
                Duration = adv.Duration,
            };

            return Ok(response);
        }

        [HttpGet("getApprovedAdv")]
        public async Task<ActionResult<AdvResponseModel>> GetApprovedAdv()
        {

            var advs = await _advService.GetApprovedAdvAsync();

            if (advs == null || !advs.Any())
                return NotFound();

            var validAdvs = new List<AdvModel>();
            foreach (var adv in advs)
            {
                if ((adv.ExpiredDate <= DateTime.Now) && adv.Status.Equals("Approved"))
                {
                    validAdvs.Add(adv);
                }
            }

            if (!validAdvs.Any())
                return NotFound();

            var response = validAdvs.Select(fillteredAdvs => new AdvResponseModel
            {
                Id = fillteredAdvs.Id,
                ShopId = fillteredAdvs.ShopId,
                Title = fillteredAdvs.Title,
                Url = fillteredAdvs.Url,
                ImageUrl = fillteredAdvs.ImageUrl,
                AdvDate = fillteredAdvs.AdvDate,
                Status = fillteredAdvs.Status,
                EditedDate = fillteredAdvs.EditedDate,
                ExpiredDate = fillteredAdvs.ExpiredDate,
                Duration = fillteredAdvs.Duration,
            });

            return Ok(response);
        }

        [HttpPost("createAdv")]
        public async Task<ActionResult> CreateAdv(AdvRequestModel request)
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
                    ImageUrl = request.ImageUrl,
                    //AdvDate = request.AdvDate,
                    //Status = request.Status,
                    //EditedDate = request.EditedDate,
                    //ExpiredDate = request.ExpiredDate,
                    //Duration = request.Duration,
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the post.");
            }
        }

        [HttpPut("updateAdv/{advId}")]
        public async Task<ActionResult> UpdateAdv(int advId, AdvUpdateRequestModel advRequestModel)
        {

            AdvModel advModel = await _advService.GetAdvByIdAsync(advId);

            if (advModel == null)
                return NotFound();

            try
            {
                advModel.Title = advRequestModel.Title;
                advModel.Url = advRequestModel.Url;
                advModel.ImageUrl = advRequestModel.ImageUrl;
                //advModel.AdvDate = advRequestModel.AdvDate;
                //advModel.Status = advRequestModel.Status;
                //advModel.EditedDate = advRequestModel.EditedDate;
                //advModel.ExpiredDate = advRequestModel.ExpiredDate;
                //advModel.Duration = advRequestModel.Duration;

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

        [HttpDelete("deleteAdvById/{advId}")]
        public async Task<ActionResult> DeleteAdvById(int advId)
        {
            bool success = await _advService.DeleteAdsByIdAsync(advId);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("countAdsByStatus/{status}")]
        public async Task<ActionResult> CountAdsByStatus(string status)
        {
            return Ok(await _advService.CountAdvByStatusAsync(status));
        }

    }
}
