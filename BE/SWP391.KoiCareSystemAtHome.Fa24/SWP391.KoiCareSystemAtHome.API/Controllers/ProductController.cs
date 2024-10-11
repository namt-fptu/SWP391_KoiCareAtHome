using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }
        [HttpGet("product/{postId}")]
        public async Task<ActionResult<IEnumerable<ProductResponseModel>>> GetProductByPostId(int postId)
        {
            var products = await _productService.GetProductByPostIdAsync(postId);

            if (products == null || !products.Any())
                return NotFound();

            var response = products.Select(product => new ProductResponseModel
            {
                Id = product.Id,
                PostId = product.PostId,
                Title = product.Title,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
            });

            return Ok(response);
        }

        [HttpGet("product")]
        public async Task<ActionResult<ProductResponseModel>> GetProductById(ProductRequestModel request)
        {
            var products = await _productService.GetProductByPostIdAsync(request.PostId);

            if (products == null || !products.Any())
                return NotFound();

            var product = products.Where(w => w.Id == request.ProductId).FirstOrDefault();
            if (product == null)
                return NotFound();

            var response = new ProductResponseModel
            {
                Id = product.Id,
                PostId = product.PostId,
                Title = product.Title,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
            };

            return Ok(response);
        }
    }
}
