using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
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

        [HttpGet("getProductByAdvId/{advId}")]
        public async Task<ActionResult<IEnumerable<ProductResponseModel>>> GetProductByPostId(int advId)
        {
            var products = await _productService.GetProductByPostIdAsync(advId);

            if (products == null || !products.Any())
                return NotFound();

            var response = products.Select(product => new ProductResponseModel
            {
                Id = product.Id,
                PostId = product.PostId,
                Title = product.Title,
                Url = product.Url,
                Description = product.Description,
            });

            return Ok(response);
        }

        [HttpGet("getProductById/{productId}")]
        public async Task<ActionResult<ProductResponseModel>> GetProductById(int productId)
        {
            var product = await _productService.GetProductByIdAsync(productId);

            if (product == null)
                return NotFound();

            var response = new ProductResponseModel
            {
                Id = product.Id,
                PostId = product.PostId,
                Title = product.Title,
                Url = product.Url,
                Description = product.Description,
            };

            return Ok(response);
        }

        [HttpPost("createProduct")]
        public async Task<ActionResult> CreateProduct(ProductRequestModel request)
        {
            if (request == null)
                return BadRequest("Product data is required.");

            try
            {
                ProductModel productModel = new()
                {
                    PostId = request.PostId,
                    Title = request.Title,
                    Url = request.Url,
                    Description = request.Description,
                };

                int productId = await _productService.CreateProductAsync(productModel);

                var product = await _productService.GetProductByIdAsync(productId);

                if (product == null)
                    return NotFound();

                var response = new ProductResponseModel
                {
                    Id = product.Id,
                    PostId = product.PostId,
                    Title = product.Title,
                    Url = product.Url,
                    Description = product.Description,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the product.");
            }
        }

        [HttpPut("updateProductById/{productId}")]
        public async Task<ActionResult> UpdateProduct(int productId, ProductRequestModel request)
        {
            var product = await _productService.GetProductByIdAsync(productId);

            if (product == null)
                return NotFound();
            if (request == null)
                return BadRequest("Product data is required.");

            try
            {
                product.Title = request.Title;
                product.Url = request.Url;
                product.Description = request.Description;

                bool success = await _productService.UpdateProductAsync(productId, product);

                if (!success)
                    return NotFound();

                var productResponse = await _productService.GetProductByIdAsync(productId);

                if (productResponse == null)
                    return NotFound();

                var response = new ProductResponseModel
                {
                    Id = productResponse.Id,
                    PostId = productResponse.PostId,
                    Title = productResponse.Title,
                    Url = productResponse.Url,
                    Description = productResponse.Description,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the product.");
            }
        }

        [HttpDelete("deleteProductById/{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            bool success = await _productService.DeleteProductByIdAsync(productId);

            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("deleteProductByAdvId/{advId}")]
        public async Task<ActionResult> DeleteProductByAdvId(int advId)
        {
            bool success = await _productService.DeleteProductByAdvAsync(advId);

            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("countProductByShopId/{shopId}")]
        public async Task<ActionResult> CountProductByShopId(int shopId)
        {
            int count = await _productService.CountProductAsync(shopId);

            return Ok(count);
        }

    }
}
