using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
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

        [HttpGet("getPackage")]
        public async Task<ActionResult<IEnumerable<PostPackageResponseModel>>> GetPostPackage()
        {
            var postPakages = await _postPackageService.GetPostPackageAsync();

            if (postPakages == null || !postPakages.Any()) 
                return NotFound();

            var response = postPakages.Select(p => new PostPackageResponseModel
            {
                Id = p.Id,
                Name = p.Name,
                Duration = p.Duration,
                Price = p.Price
            });

            return Ok(response);
        }

        [HttpGet("getPackage/{packageId}")]
        public async Task<ActionResult<PostPackageResponseModel>> GetPostPakageById(int packageId)
        {
            var postPackage = await _postPackageService.GetPostPackageByIdAsync(packageId);

            if(postPackage == null)
                return NotFound();

            var response = new PostPackageResponseModel
            {
                Id = postPackage.Id,
                Name = postPackage.Name,
                Duration = postPackage.Duration,
                Price = postPackage.Price
            };

            return Ok(response);
        }

        [HttpPost("createPackage")]
        public async Task<ActionResult> CreatePostPackage(PostPackageRequestModel request)
        {
            if (request == null)
                return BadRequest("Post package data is required.");

            try
            {
                PostPackageModel postPackageModel = new()
                {
                    Name = request.Name,
                    Duration = request.Duration,
                    Price = request.Price
                };

                int packageId = await _postPackageService.CreatePostPackageAsync(postPackageModel);

                var postPackage = await _postPackageService.GetPostPackageByIdAsync(packageId);

                if (postPackage == null)
                    return NotFound();

                var response = new PostPackageResponseModel
                {
                    Id = packageId,
                    Name = postPackage.Name,
                    Duration = postPackage.Duration,
                    Price = postPackage.Price
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the post package.");
            }
        }

        [HttpPut("updatePackage/{packageId}")]
        public async Task<ActionResult> UpdatePostPageke(int packageId, PostPackageRequestModel request)
        {
            var package = await _postPackageService.GetPostPackageByIdAsync(packageId);

            if (package == null)
                return NotFound();
            if (request == null)
                return BadRequest("Post package data is required.");
            try
            {
                package.Name = request.Name;
                package.Duration = request.Duration;
                package.Price = request.Price;

                bool success = await _postPackageService.UpdatePostPakageAsync(packageId, package);

                if (!success)
                    return NotFound();

                var postPackage = await _postPackageService.GetPostPackageByIdAsync(packageId);

                if (postPackage == null)
                    return NotFound();

                var response = new PostPackageResponseModel
                {
                    Id = postPackage.Id,
                    Name = postPackage.Name,
                    Duration = postPackage.Duration,
                    Price = postPackage.Price
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the post package.");
            }
        }

        //[HttpDelete("deletePakage/{packageId}")]
        //public async Task<ActionResult> DeletePackage(int packageId)
        //{
        //    bool success = await _postPackageService.DeletePostPakageAsync(packageId);

        //    if (!success)
        //        return NotFound();

        //    return NoContent();
        //}

    }
}
