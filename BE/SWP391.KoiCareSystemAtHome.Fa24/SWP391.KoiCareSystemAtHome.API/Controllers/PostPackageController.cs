using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
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

        [HttpGet("postPackageId/{postPackageId}")]
        public async Task<ActionResult<PostPackageResponseModel>> GetPostPackageById(int postPackageId)
        {

            var postPackage = await _postPackageService.GetPostPackageByIdAsync(postPackageId);

            if (postPackage == null)
                return NotFound();

            var response = new PostPackageResponseModel
            {
                Id = postPackage.Id,
                Name = postPackage.Name,
                Price = postPackage.Price,
                Duration = postPackage.Duration,
            };

            return Ok(response);
        }


        [HttpPost("createPostPackage")]
        public async Task<ActionResult> CreatePostPackage(PostPackageModel request)
        {
            if (request == null)
                return BadRequest("Post package data is required.");
            try
            {
                var postPackageModdel = new PostPackageModel
                {
                    Name = request.Name,
                    Price=request.Price,
                    Duration = request.Duration,

                };

                int postPackageId = await _postPackageService.CreatePostPackageAsync(postPackageModdel);
                var postPackage = await _postPackageService.GetPostPackageByIdAsync(postPackageId);

                if (postPackage == null)
                    return NotFound();

                var response = new PostPackageResponseModel
                {
                    Id = postPackage.Id,
                    Name = postPackage.Name,
                    Price = postPackage.Price,
                    Duration = postPackage.Duration,

                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the post package.");
            }
        }

        [HttpPut("updatePostPackage/{postPackageId}")]
        public async Task<ActionResult> UpdatePostPackage(int postPackageId, PostPackageRequestModel postPackageRequestModel)
        {
            PostPackageModel postPackageModel = await _postPackageService.GetPostPackageByIdAsync(postPackageId);

            if (postPackageModel == null)
                return NotFound();

            try
            {
                postPackageModel.Name = postPackageRequestModel.Name;
                postPackageModel.Price = postPackageRequestModel.Price;
                postPackageModel.Duration = postPackageRequestModel.Duration;

                bool success = await _postPackageService.UpdatePostPackageAsync(postPackageId, postPackageModel);

                if (!success)
                    return NotFound();

                var postPackage = await _postPackageService.GetPostPackageByIdAsync(postPackageId);

                if (postPackage == null)
                    return NotFound();

                var response = new PostPackageResponseModel
                {
                    Id = postPackageId,
                    Name = postPackageRequestModel.Name,
                    Price = postPackageRequestModel.Price,
                    Duration = postPackageRequestModel.Duration,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the post package");
            }
        }

        [HttpDelete("deletePostPackage/{postPackageId}")]
        public async Task<ActionResult> DeletePostPackage(int postPackageId)
        {
            bool success = await _postPackageService.DeletePostPackageAsync(postPackageId);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
