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

        [HttpGet("koiStandard")]
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
                StandardLength = g.StandardLength,
                StandardWeigth = g.StandardWeigth,
                MaxFeed = g.MaxFeed,
                MinFeed = g.MinFeed
            });

            return Ok(response);
        }

        [HttpGet("koiStandard/{koiStandardId}")]
        public async Task<ActionResult<KoiGrowthStandardModel>> GetKoiGrowthStandardByVariety(int koiStandardId)
        {
            var koiGrowthStandard = await _koiGrowthStandardService.KoiGrowthStandardModelAsync(koiStandardId);

            if (koiGrowthStandard == null)
                return NotFound();

            var response = new koiGrowthStandardResponseModel
            {
                Id = koiGrowthStandard.Id,
                KoiVariety = koiGrowthStandard.KoiVariety,
                Stage = koiGrowthStandard.Stage,
                StandardLength = koiGrowthStandard.StandardLength,
                StandardWeigth = koiGrowthStandard.StandardWeigth,
                MaxFeed = koiGrowthStandard.MaxFeed,
                MinFeed = koiGrowthStandard.MinFeed
            };

            return Ok(response);
        }

        [HttpPost("createKoiGrowthStandard")]
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
                    StandardLength = request.StandardLength,
                    StandardWeigth = request.StandardWeigth,
                    MaxFeed = request.MaxFeed,
                    MinFeed = request.MinFeed
                };

                int koiStandardId = await _koiGrowthStandardService.CreateKoiGrowthStandardAsync(model);

                var koiGrowthStandard = await _koiGrowthStandardService.KoiGrowthStandardModelAsync(koiStandardId);

                if (koiGrowthStandard == null)
                    return NotFound();

                var response = new koiGrowthStandardResponseModel
                {
                    Id = koiGrowthStandard.Id,
                    KoiVariety = koiGrowthStandard.KoiVariety,
                    Stage = koiGrowthStandard.Stage,
                    StandardLength = koiGrowthStandard.StandardLength,
                    StandardWeigth = koiGrowthStandard.StandardWeigth,
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

    }
}
