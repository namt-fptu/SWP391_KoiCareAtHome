using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("koiStandard/{variety}")]
        public async Task<ActionResult<KoiGrowthStandardModel>> GetKoiGrowthStandardByVariety(string variety)
        {
            var koiGrowthStandard = await _koiGrowthStandardService.KoiGrowthStandardModelAsync(variety);

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
    }
}
