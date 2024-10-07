using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
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

        [HttpGet("pond/{pondId}")]
        public async Task<ActionResult<PondResponseModel>> GetPondById(int pondId)
        {

            var pond = await _pondService.GetPondByIdAsync(pondId);

            if (pond == null)
                return NotFound();

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

        [HttpPost("createPond")]
        public async Task<ActionResult> CreatePond(PondRequestModel request)
        {
            if (request == null)
                return BadRequest("Pond data is required.");

            try
            {
                PondModel model = new()
                {
                    PondOwnerId = request.PondOwnerId,
                    Name = request.Name,
                    Depth = request.Depth,
                    Volume = request.Volume,
                    DraimCount = request.DraimCount,
                    SkimmerCount = request.SkimmerCount,
                    PumpingCapacity = request.PumpingCapacity

                };

                int pondId = await _pondService.CreatePondAsync(model);

                var pond = await _pondService.GetPondByIdAsync(pondId);

                if (pond == null)
                    return NotFound();

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
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601) // Unique constraint violation
            {
                return Conflict("An pond with the same name already exists.");
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the pond.");
            }
        }

        //[HttpPut]
        //public async Task<ActionResult> UpdatePond(PondModel pondModelmodel, GetPondRequestModel getPondRequestModel)
        //{

        //}

    }
}
