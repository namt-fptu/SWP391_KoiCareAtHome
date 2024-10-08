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
    public class KoiVarietyController : ControllerBase
    {
        private readonly KoiVarietyService _koiVarietyService;

        public KoiVarietyController(KoiVarietyService koiVarietyService)
        {
            _koiVarietyService = koiVarietyService;
        }

        [HttpGet("variety")]
        public async Task<ActionResult<IEnumerable<KoiVarietyResponseModel>>> GetKoiVariety()
        {
            var koiVarietys = await _koiVarietyService.GetAllKoiVarietyAsync();

            if (koiVarietys == null || !koiVarietys.Any())
                return NotFound();

            var response = koiVarietys.Select(k => new KoiVarietyResponseModel
            {
                Variety = k.Variety,
                Color = k.Color,
                Rarity = k.Rarity,
            });

            return Ok(response);
        }

        [HttpGet("variety/{variety}")]
        public async Task<ActionResult<KoiVarietyResponseModel>> GetKoiVariety(string variety)
        {
            var koiVariety = await _koiVarietyService.GetKoiVarietyAsync(variety);

            if (koiVariety == null)
                return NotFound();

            var response = new KoiVarietyResponseModel
            {
                Variety = koiVariety.Variety,
                Color = koiVariety.Color,
                Rarity = koiVariety.Rarity,
            };

            return Ok(response);
        }

        [HttpPost("createKoiVariety")]
        public async Task<ActionResult> CreateKoiVariety(KoiVarietyRequestModel request)
        {
            if (request == null)
                return BadRequest("Koi variety data is required.");

            try
            {
                KoiVarietyModel model = new()
                {
                    Variety = request.Variety,
                    Rarity = request.Rarity,
                    Color = request.Color,
                };

                string variety = await _koiVarietyService.CreateKoiVarietyAsync(model);

                var koiVariety = await _koiVarietyService.GetKoiVarietyAsync(variety);

                if (koiVariety == null)
                    return NotFound();

                var response = new KoiVarietyResponseModel
                {
                    Variety = koiVariety.Variety,
                    Color = koiVariety.Color,
                    Rarity = koiVariety.Rarity,
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
