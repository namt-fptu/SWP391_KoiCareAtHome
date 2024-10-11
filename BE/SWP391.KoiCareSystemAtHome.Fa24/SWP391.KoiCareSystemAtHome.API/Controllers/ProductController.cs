﻿using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Repository;
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

        [HttpGet("productId/{productId}")]
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
                ImageUrl = product.ImageUrl,
                Description = product.Description,
            };

            return Ok(response);
        }


        [HttpPost("createProduct")]
        public async Task<ActionResult> CreateProduct(ProductModel request)
        {
            if (request == null)
                return BadRequest("Product data is required.");
            try
            {
                var productModdel = new ProductModel
                {
                    PostId = request.PostId,
                    Title = request.Title,
                    ImageUrl = request.ImageUrl,
                    Description = request.Description,

                };

                int productId = await _productService.CreateProductAsync(productModdel);
                var product = await _productService.GetProductByIdAsync(productId);

                if (product == null)
                    return NotFound();

                var response = new ProductResponseModel
                {
                    Id= product.Id,
                    PostId = product.PostId,
                    Title = product.Title,
                    ImageUrl = product.ImageUrl,
                    Description = product.Description,

                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the product.");
            }
        }

        [HttpPut("updateProduct/{productId}")]
        public async Task<ActionResult> UpdateProduct(int productId, ProductRequestModel productRequestModel)
        {
            ProductModel productModel = await _productService.GetProductByIdAsync(productId);

            if (productModel == null)
                return NotFound();

            try
            {
                productModel.Title = productRequestModel.Title;
                productModel.ImageUrl = productRequestModel.ImageUrl;
                productRequestModel.Description = productRequestModel.Description;

                bool success = await _productService.UpdateProductAsync(productId, productModel);

                if (!success)
                    return NotFound();

                var product = await _productService.GetProductByIdAsync(productId);

                if (product == null)
                    return NotFound();

                var response = new ProductResponseModel
                {
                    Id = product.Id,
                    PostId = product.PostId,
                    Title= product.Title,
                    ImageUrl = product.ImageUrl,
                    Description = product.Description,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the product.");
            }
        }

        [HttpDelete("deleteProduct/{productId}")]
        public async Task<ActionResult> DeleteAdv(int productId)
        {
            bool success = await _productService.DeleteProductAsync(productId);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
