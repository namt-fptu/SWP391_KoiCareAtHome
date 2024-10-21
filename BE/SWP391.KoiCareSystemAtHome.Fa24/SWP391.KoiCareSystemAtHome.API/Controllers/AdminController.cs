using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository.Models;
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
        public async Task<ActionResult<IEnumerable<AdvResponseModel>>> GetAdvByStatus(string status)
        {

            var advs = await _advService.GetAdvByStatusAsync(status);

            if (advs == null || !advs.Any())
                return NotFound();

            var response = advs.Select(adv => new AdvResponseModel
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
            });

            return Ok(response);
        }

        [HttpPut("approveAdv/{advId}")]
        public async Task<ActionResult> ApproveAdv(int advId, string status)
        {

            var advs = await _advService.GetAdvByStatusAsync("Processing");

            if (advs == null || !advs.Any())
                return NotFound();

            var advModel = advs.FirstOrDefault(a => a.Id == advId);

            if (advModel == null)
                return NotFound();

            try
            {
                if (status.Equals("Approved"))
                {
                    advModel.Status = status;
                    advModel.ExpiredDate = DateTime.Now.AddDays(advModel.Duration);

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
                else if (status.Equals("Rejected"))
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
                else
                {
                    return BadRequest("Invalid status!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the post.");
            }
        }

    }
}
