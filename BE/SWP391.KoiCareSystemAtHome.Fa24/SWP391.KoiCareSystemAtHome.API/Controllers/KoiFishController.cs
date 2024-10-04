using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository.Models;
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

        [HttpPost("koiFish")]
        public async Task<ActionResult<KoiFishResponseModel>> GetKoiFishById(KoiFishRequestModel request)
        {
            var koiFishs = await _koiFishService.GetKoiFishByPondIdAsync(request.PondId);

            if (koiFishs == null || !koiFishs.Any())
                return NotFound();

            var koiFish = koiFishs.Where(k => k.Id == request.KoiFishId).FirstOrDefault();
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

    }
}
