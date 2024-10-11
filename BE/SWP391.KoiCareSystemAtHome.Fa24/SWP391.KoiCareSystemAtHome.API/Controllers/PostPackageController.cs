using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391_KoiManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostPackageController : ControllerBase
    {
        private readonly PostPackageService _postPackageService;

        public PostPackageController(PostPackageService postPackageService)
        {
            _postPackageService = postPackageService;
        }
        [HttpGet("postPackage")]
        public async Task<ActionResult<IEnumerable<PostPackageResponseModel>>> GetPostPackageByPostId(int id)
        {
            var postPackages = await _postPackageService.GetPostPackageByIdAsync(id);

            if (postPackages == null || !postPackages.Any())
                return NotFound();

            var response = postPackages.Select(pp => new PostPackageResponseModel
            {
                 Id = pp.Id,
                 Name = pp.Name,
                 Duration = pp.Duration,
                 Price = pp.Price,
            });
            return Ok(response);
        }

        [HttpPost("postPackage")]
        public async Task<ActionResult<PostPackageResponseModel>> GePostPackageById(PostPackageRequestModel request)
        {
            var postPackages = await _postPackageService.GetPostPackageByIdAsync(request.PostPackageId);

            if (postPackages == null || !postPackages.Any())
                return NotFound();

            var postPackage = postPackages.Where(k => k.Id == request.PostPackageId).FirstOrDefault();
            if (postPackage == null)
                return NotFound();

            var response = new PostPackageResponseModel
            {
                Id=postPackage.Id,
                Name=postPackage.Name,
                Duration = postPackage.Duration,
                Price = postPackage.Price,
            };

            return Ok(response);
        }

    }
}
