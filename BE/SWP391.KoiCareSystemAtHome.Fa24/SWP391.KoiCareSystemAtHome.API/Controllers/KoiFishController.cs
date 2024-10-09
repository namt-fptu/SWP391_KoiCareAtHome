using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class KoiFishController : ControllerBase
    {
        private readonly KoiFishService _koiFishService;

        public KoiFishController(KoiFishService koiFishService)
        {
            _koiFishService = koiFishService;
        }

        [HttpGet("koiFish/{pondId}")]
        public async Task<ActionResult<IEnumerable<KoiFishResponseModel>>> GetKoiFishByPondId(int pondId)
        {
            var koiFishs = await _koiFishService.GetKoiFishByPondIdAsync(pondId);

            if (koiFishs == null || !koiFishs.Any())
                return NotFound();

            var response = koiFishs.Select(k => new KoiFishResponseModel
            {
                Id = k.Id,
                PondId = k.PondId,
                KoiVariety = k.KoiVariety,
                KoiName = k.KoiName,
                Dob = k.Dob,
                Sex = k.Sex,
                Price = k.Price,
                ImageUrl = k.ImageUrl,
            });
            return Ok(response);
        }

        [HttpGet("koiFishId/{koiFishId}")]
        public async Task<ActionResult<KoiFishResponseModel>> GetKoiFishById(int koiFishId)
        {

            var koiFish = await _koiFishService.GetKoiFishByIdAsync(koiFishId);

            if (koiFish == null)
                return NotFound();

            var response = new KoiFishResponseModel
            {
                Id = koiFish.Id,
                PondId = koiFish.PondId,
                KoiVariety = koiFish.KoiVariety,
                KoiName = koiFish.KoiName,
                Dob = koiFish.Dob,
                Sex = koiFish.Sex,
                Price = koiFish.Price,
                ImageUrl = koiFish.ImageUrl,
            };

            return Ok(response);
        }

        [HttpPost("createKoiFish")]
        public async Task<ActionResult> CreateKoiFish(KoiFishRequestModel request)
        {
            if (request == null)
                return BadRequest("Koi fish data is required.");
            try
            {
                var koiFishModdel = new KoiFishModel
                {
                    PondId = request.PondId,
                    KoiVariety = request.KoiVariety,
                    KoiName = request.KoiName,
                    Dob = request.Dob,
                    Sex = request.Sex,
                    Price = request.Price,
                    ImageUrl = request.ImageUrl
                };

                int koiFishId = await _koiFishService.CreateKoiFishAsync(koiFishModdel);

                var koiFish = await _koiFishService.GetKoiFishByIdAsync(koiFishId);

                if (koiFish == null)
                    return NotFound();

                var response = new KoiFishResponseModel
                {
                    Id = koiFish.Id,
                    PondId = koiFish.PondId,
                    KoiVariety = koiFish.KoiVariety,
                    KoiName = koiFish.KoiName,
                    Dob = koiFish.Dob,
                    Sex = koiFish.Sex,
                    Price = koiFish.Price,
                    ImageUrl = koiFish.ImageUrl,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the koi fish.");
            }
        }

        [HttpPut("updateFish/{fishId}")]
        public async Task<ActionResult> UpdateKoiFish(int fishId, KoiFishRequestModel koiFishRequestModel)
        {
            KoiFishModel koiFishModel = await _koiFishService.GetKoiFishByIdAsync(fishId);

            if (koiFishModel == null)
                return NotFound();

            try
            {
                koiFishModel.KoiName = koiFishRequestModel.KoiName;
                koiFishModel.Sex = koiFishRequestModel.Sex;
                koiFishModel.ImageUrl = koiFishRequestModel.ImageUrl;
                koiFishModel.Dob = koiFishRequestModel.Dob;
                koiFishModel.Price = koiFishRequestModel.Price;

                bool success = await _koiFishService.UpdateKoiFishAsync(fishId, koiFishModel);

                if (!success)
                    return NotFound();

                var koiFish = await _koiFishService.GetKoiFishByIdAsync(fishId);

                if (koiFish == null)
                    return NotFound();

                var response = new KoiFishResponseModel
                {
                    Id = koiFish.Id,
                    PondId = koiFish.PondId,
                    KoiVariety = koiFish.KoiVariety,
                    KoiName = koiFish.KoiName,
                    Dob = koiFish.Dob,
                    Sex = koiFish.Sex,
                    Price = koiFish.Price,
                    ImageUrl = koiFish.ImageUrl,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the pond.");
            }
        }

        [HttpDelete("deleteKoiFish/{koiId}")]
        public async Task<ActionResult> DeleteKoiFish(int koiId)
        {
            bool success = await _koiFishService.DeleteKoiFishAsync(koiId);
            if (!success)
                return NotFound();

            return NoContent();
        }

    }
}
