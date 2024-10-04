using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PondController : ControllerBase
    {
        private readonly PondService _pondService;

        public PondController(PondService pondService)
        {
            _pondService = pondService;
        }

        [HttpGet("ponds/{ownerId}")]
        public async Task<ActionResult<IEnumerable<PondResponseModel>>> GetPondByOwnerId(int ownerId)
        {
            var ponds = await _pondService.GetPondByOwnerIdAsync(ownerId);

            if (ponds == null || !ponds.Any())
                return NotFound();

            var response = ponds.Select(pond => new PondResponseModel
            {
                Id = pond.Id,
                PondOwnerId = pond.PondOwnerId,
                Name = pond.Name,
                Depth = pond.Depth,
                Volume = pond.Volume,
                DrainCount = pond.DraimCount,
                PumpingCapacity = pond.PumpingCapacity,
                SkimmerCount = pond.SkimmerCount
            });

            return Ok(response);
        }

        [HttpPost("pond")]
        public async Task<ActionResult<PondResponseModel>> GetPondById(PondRequestModel request)
        {
            var ponds = await _pondService.GetPondByOwnerIdAsync(request.PondOwnerId);

            if (ponds == null || !ponds.Any())
            {
                return NotFound();
            }

            var pond = ponds.Where(p => p.Id == request.PondId).FirstOrDefault();
            if (pond == null)
            {
                return NotFound();
            }

            var Response = new PondResponseModel
            {
                Id = pond.Id,
                PondOwnerId = pond.PondOwnerId,
                Name = pond.Name,
                Depth = pond.Depth,
                Volume = pond.Volume,
                DrainCount = pond.DraimCount,
                SkimmerCount = pond.SkimmerCount,
                PumpingCapacity = pond.PumpingCapacity
            };

            return Ok(Response);
        }
    }
}
