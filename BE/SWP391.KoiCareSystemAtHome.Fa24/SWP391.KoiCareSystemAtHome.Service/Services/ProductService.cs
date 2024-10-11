using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class ProductService
    {
        private readonly UnitOfWork _unitOfWork;

        public ProductService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ProductModel>> GetProductByPostIdAsync(int id)
        {
            var product = await _unitOfWork.Products.GetAsync();
            var productOfPost = product.Where(p => p.PostId == id);

            if (productOfPost.Any())
                return Enumerable.Empty<ProductModel>();

            var productModels = productOfPost.Select(p => new ProductModel
            {
                Id = p.Id,
                PostId = p.PostId,
                Title = p.Title,
                ImageUrl = p.ImageUrl,
                Description = p.Description,

            });
            return productModels;
        }

        public async Task<ProductModel> GetProductByIdAsync(int productId)
        {
            var products = await _unitOfWork.Products.GetAsync();

            var product = products.FirstOrDefault(pd => pd.Id == productId);

            if (product == null)
                return null;

            var productModel = new ProductModel
            {
                Id = product.Id,
                PostId = product.PostId,
                Title = product.Title,
                ImageUrl = product.ImageUrl,
                Description = product.Description,

            };
            return productModel;
        }
        public async Task<int> CreateProductAsync(ProductModel productModel)
        {
            var productEntity = new Product
            {
                Id = productModel.Id,
                Title = productModel.Title,
                ImageUrl = productModel.ImageUrl,
                Description = productModel.Description,
            };

            await _unitOfWork.Products.InsertAsync(productEntity);
            await _unitOfWork.SaveAsync();

            return productEntity.Id;
        }

        public async Task<bool> UpdateProductAsync(int productId, ProductModel productModel)
        {
            var products = await _unitOfWork.Products.GetAsync();
            var product = products.FirstOrDefault(pd => pd.Id == productId);

            if (product == null)
                return false;

            product.Title = productModel.Title;
            product.ImageUrl = productModel.ImageUrl;
            product.Description = productModel.Description;

            _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveAsync();


            return true;
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var products = await _unitOfWork.Products.GetAsync();
            if (products == null)
                return false;

            var productToUpdate = products.Where(x => x.Id == productId).FirstOrDefault();
            if (productToUpdate == null)
                return false;

            _unitOfWork.Products.DeleteAsync(productToUpdate);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
