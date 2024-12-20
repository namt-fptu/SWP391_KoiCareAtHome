using Microsoft.AspNetCore.Authorization;
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
    public class koiGrowthStandardController : ControllerBase
    {
        private readonly KoiGrowthStandardService _koiGrowthStandardService;

        public koiGrowthStandardController(KoiGrowthStandardService koiGrowthStandardService)
        {
            _koiGrowthStandardService = koiGrowthStandardService;
        }

        [HttpGet("koiStandard"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<KoiGrowthStandardModel>>> GetkoiGrowthStandard()
        {
            var koiGrowthStandards = await _koiGrowthStandardService.GetAllKoiGrowthStandardsAsync();

            if (koiGrowthStandards == null || !koiGrowthStandards.Any())
                return NotFound();

            var response = koiGrowthStandards.Select(g => new koiGrowthStandardResponseModel
            {
                Id = g.Id,
                KoiVariety = g.KoiVariety,
                Stage = g.Stage,
                MaxLength = g.MaxLength,
                MinLength = g.MinLength,
                MaxWeigth = g.MaxWeigth,
                MinWeigth = g.MinWeigth,
                MaxFeed = g.MaxFeed,
                MinFeed = g.MinFeed
            });

            return Ok(response);
        }

        [HttpGet("koiStandard/{koiStandardId}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<KoiGrowthStandardModel>> GetKoiGrowthStandardByVariety(int koiStandardId)
        {
            var koiGrowthStandard = await _koiGrowthStandardService.GetKoiGrowthStandardModelAsync(koiStandardId);

            if (koiGrowthStandard == null)
                return NotFound();

            var response = new koiGrowthStandardResponseModel
            {
                Id = koiGrowthStandard.Id,
                KoiVariety = koiGrowthStandard.KoiVariety,
                Stage = koiGrowthStandard.Stage,
                MaxLength = koiGrowthStandard.MaxLength,
                MinLength = koiGrowthStandard.MinLength,
                MaxWeigth = koiGrowthStandard.MaxWeigth,
                MinWeigth = koiGrowthStandard.MinWeigth,
                MaxFeed = koiGrowthStandard.MaxFeed,
                MinFeed = koiGrowthStandard.MinFeed
            };

            return Ok(response);
        }

        [HttpPost("createKoiGrowthStandard"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateKoiGrowthStandard(KoiGrowthStandardRequestModel request)
        {
            if (request == null)
                return BadRequest("Koi growth standard data is required");
            try
            {
                KoiGrowthStandardModel model = new()
                {
                    KoiVariety = request.KoiVariety,
                    Stage = request.Stage,
                    MaxLength = request.MaxLength,
                    MinLength = request.MinLength,
                    MaxWeigth = request.MaxWeigth,
                    MinWeigth = request.MinWeigth,
                    MaxFeed = request.MaxFeed,
                    MinFeed = request.MinFeed
                };

                int koiStandardId = await _koiGrowthStandardService.CreateKoiGrowthStandardAsync(model);

                var koiGrowthStandard = await _koiGrowthStandardService.GetKoiGrowthStandardModelAsync(koiStandardId);

                if (koiGrowthStandard == null)
                    return NotFound();

                var response = new koiGrowthStandardResponseModel
                {
                    Id = koiGrowthStandard.Id,
                    KoiVariety = koiGrowthStandard.KoiVariety,
                    Stage = koiGrowthStandard.Stage,
                    MaxLength = koiGrowthStandard.MaxLength,
                    MinLength = koiGrowthStandard.MinLength,
                    MaxWeigth = koiGrowthStandard.MaxWeigth,
                    MinWeigth = koiGrowthStandard.MinWeigth,
                    MaxFeed = koiGrowthStandard.MaxFeed,
                    MinFeed = koiGrowthStandard.MinFeed
                };

                return Ok(response);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the water report.");
            }
        }

        [HttpPut("updateKoiStandard/{koiStandardId}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateKoiGrowthStandars(int koiStandardId, KoiGrowthStandardRequestModel koiGrowthStandardRequestModel)
        {
            KoiGrowthStandardModel koiGrowthStandardModel = await _koiGrowthStandardService.GetKoiGrowthStandardModelAsync(koiStandardId);

            if (koiGrowthStandardModel == null)
                return NotFound();

            try
            {
                koiGrowthStandardModel.Stage = koiGrowthStandardRequestModel.Stage;
                koiGrowthStandardModel.MaxLength = koiGrowthStandardRequestModel.MaxLength;
                koiGrowthStandardModel.MinLength = koiGrowthStandardRequestModel.MinLength;
                koiGrowthStandardModel.MaxWeigth = koiGrowthStandardRequestModel.MaxWeigth;
                koiGrowthStandardModel.MinWeigth = koiGrowthStandardRequestModel.MinWeigth;
                koiGrowthStandardModel.MaxFeed = koiGrowthStandardRequestModel.MaxFeed;
                koiGrowthStandardModel.MinFeed = koiGrowthStandardRequestModel.MinFeed;

                bool success = await _koiGrowthStandardService.UpdateKoiGrowthStandardAsync(koiStandardId, koiGrowthStandardModel);

                if (!success)
                    return NotFound();

                var koiGrowthStandard = await _koiGrowthStandardService.GetKoiGrowthStandardModelAsync(koiStandardId);

                if (koiGrowthStandard == null)
                    return NotFound();

                var response = new koiGrowthStandardResponseModel
                {
                    Id = koiGrowthStandard.Id,
                    KoiVariety = koiGrowthStandard.KoiVariety,
                    Stage = koiGrowthStandard.Stage,
                    MaxLength = koiGrowthStandard.MaxLength,
                    MinLength = koiGrowthStandard.MinLength,
                    MaxWeigth = koiGrowthStandard.MaxWeigth,
                    MinWeigth = koiGrowthStandard.MinWeigth,
                    MaxFeed = koiGrowthStandard.MaxFeed,
                    MinFeed = koiGrowthStandard.MinFeed
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the water report.");
            }
        }

        [HttpDelete("deleteKoiGrowthStandard/{id}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteKoiGrowthStandard(int id)
        {
            bool success = await _koiGrowthStandardService.DeleteKoiGrowthStandardAsync(id);

            if (!success)
                return NotFound();

            return NoContent();
        }

    }
}
