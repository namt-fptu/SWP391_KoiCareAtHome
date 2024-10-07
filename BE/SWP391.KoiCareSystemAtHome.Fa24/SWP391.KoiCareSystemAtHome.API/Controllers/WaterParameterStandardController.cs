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
    public class WaterParameterStandardController : ControllerBase
    {
        private readonly WaterParameterStandardService _waterParameterStandardService;

        public WaterParameterStandardController(WaterParameterStandardService waterParameterStandardService)
        {
            _waterParameterStandardService = waterParameterStandardService;
        }

        [HttpGet("waterStandard")]
        public async Task<ActionResult<IEnumerable<WaterParameterStandardResoponseModel>>> GetAllWaterParameterStandard()
        {
            var waterParameterStandards = await _waterParameterStandardService.GetAllWaterParameterStandardsAsync();
            if (waterParameterStandards == null || !waterParameterStandards.Any())
                return NotFound();

            var response = waterParameterStandards.Select(p => new WaterParameterStandardResoponseModel
            {
                Id = p.Id,
                KoiVariety = p.KoiVariety,
                Stage = p.Stage,
                MaxTemp = p.MaxTemp,
                MinTemp = p.MinTemp,
                MaxPh = p.MaxPh,
                MinPh = p.MinPh,
                MaxHardness = p.MaxHardness,
                MinHardness = p.MinHardness,
                MaxOxigen = p.MaxOxigen,
                MinOxigen = p.MinOxigen,
                MaxCabondioxide = p.MaxCabondioxide,
                MinCabondioxide = p.MinCabondioxide,
                MaxSalt = p.MaxSalt,
                MinSalt = p.MinSalt,
                MaxNitrates = p.MaxNitrates,
                MinNitrates = p.MinNitrates,
                MaxAmonium = p.MaxAmonium,
                MinAmonium = p.MinAmonium,
                MaxNitrite = p.MaxNitrite,
                MinNitrite = p.MinNitrite
            });

            return Ok(response);
        }

        [HttpGet("waterStandard/{id}")]
        public async Task<ActionResult<WaterParameterStandardResoponseModel>> GetWaterParameterStandardByVariety(int id)
        {
            var waterParameterStandard = await _waterParameterStandardService.GetWaterParameterStandardByVarietyAsync(id);
            if (waterParameterStandard == null)
                return NotFound();

            var response = new WaterParameterStandardResoponseModel
            {
                Id = waterParameterStandard.Id,
                KoiVariety = waterParameterStandard.KoiVariety,
                Stage = waterParameterStandard.Stage,
                MaxTemp = waterParameterStandard.MaxTemp,
                MinTemp = waterParameterStandard.MinTemp,
                MaxPh = waterParameterStandard.MaxPh,
                MinPh = waterParameterStandard.MinPh,
                MaxHardness = waterParameterStandard.MaxHardness,
                MinHardness = waterParameterStandard.MinHardness,
                MaxOxigen = waterParameterStandard.MaxOxigen,
                MinOxigen = waterParameterStandard.MinOxigen,
                MaxCabondioxide = waterParameterStandard.MaxCabondioxide,
                MinCabondioxide = waterParameterStandard.MinCabondioxide,
                MaxSalt = waterParameterStandard.MaxSalt,
                MinSalt = waterParameterStandard.MinSalt,
                MaxNitrates = waterParameterStandard.MaxNitrates,
                MinNitrates = waterParameterStandard.MinNitrates,
                MaxAmonium = waterParameterStandard.MaxAmonium,
                MinAmonium = waterParameterStandard.MinAmonium,
                MaxNitrite = waterParameterStandard.MaxNitrite,
                MinNitrite = waterParameterStandard.MinNitrite
            };

            return Ok(response);
        }

        [HttpPost("createWaterPameterStandard")]
        public async Task<ActionResult> CreateWaterPameterStandard(WaterParameterStandardRequestModel request)
        {
            if (request == null)
                return BadRequest("Water pameter standard data is required.");

            try
            {
                WaterParameterStandardModel model = new()
                {
                    KoiVariety = request.KoiVariety,
                    Stage = request.Stage,
                    MaxTemp = request.MaxTemp,
                    MinTemp = request.MinTemp,
                    MaxPh = request.MaxPh,
                    MinPh = request.MinPh,
                    MaxHardness = request.MaxHardness,
                    MinHardness = request.MinHardness,
                    MaxOxigen = request.MaxOxigen,
                    MinOxigen = request.MinOxigen,
                    MaxCabondioxide = request.MaxCabondioxide,
                    MinCabondioxide = request.MinCabondioxide,
                    MaxSalt = request.MaxSalt,
                    MinSalt = request.MinSalt,
                    MaxNitrates = request.MaxNitrates,
                    MinNitrates = request.MinNitrates,
                    MaxAmonium = request.MaxAmonium,
                    MinAmonium = request.MinAmonium,
                    MaxNitrite = request.MaxNitrite,
                    MinNitrite = request.MinNitrite
                };
                int waterPameterStandardId = await _waterParameterStandardService.CreateWaterParameterStandardAsync(model);

                var waterParameterStandard = await _waterParameterStandardService.GetWaterParameterStandardByVarietyAsync(waterPameterStandardId);

                if (waterParameterStandard == null)
                    return NotFound();

                var response = new WaterParameterStandardResoponseModel
                {
                    Id = waterParameterStandard.Id,
                    KoiVariety = waterParameterStandard.KoiVariety,
                    Stage = waterParameterStandard.Stage,
                    MaxTemp = waterParameterStandard.MaxTemp,
                    MinTemp = waterParameterStandard.MinTemp,
                    MaxPh = waterParameterStandard.MaxPh,
                    MinPh = waterParameterStandard.MinPh,
                    MaxHardness = waterParameterStandard.MaxHardness,
                    MinHardness = waterParameterStandard.MinHardness,
                    MaxOxigen = waterParameterStandard.MaxOxigen,
                    MinOxigen = waterParameterStandard.MinOxigen,
                    MaxCabondioxide = waterParameterStandard.MaxCabondioxide,
                    MinCabondioxide = waterParameterStandard.MinCabondioxide,
                    MaxSalt = waterParameterStandard.MaxSalt,
                    MinSalt = waterParameterStandard.MinSalt,
                    MaxNitrates = waterParameterStandard.MaxNitrates,
                    MinNitrates = waterParameterStandard.MinNitrates,
                    MaxAmonium = waterParameterStandard.MaxAmonium,
                    MinAmonium = waterParameterStandard.MinAmonium,
                    MaxNitrite = waterParameterStandard.MaxNitrite,
                    MinNitrite = waterParameterStandard.MinNitrite
                };

                return Ok(response);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the pond.");
            }
        }

    }
}
