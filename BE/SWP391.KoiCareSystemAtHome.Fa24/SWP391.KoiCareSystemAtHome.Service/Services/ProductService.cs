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

            if (!productOfPost.Any())
                return Enumerable.Empty<ProductModel>();

            var productModels = productOfPost.Select(p => new ProductModel
            {
                Id = p.Id,
                PostId = p.PostId,
                Title = p.Title,
                Url = p.Url,
                Description = p.Description,

            });

            return productModels;
        }

        public async Task<ProductModel?> GetProductByIdAsync(int productId)
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
                Url = product.Url,
                Description = product.Description,

            };

            return productModel;
        }
        public async Task<int> CreateProductAsync(ProductModel productModel)
        {
            var productEntity = new Product
            {
                PostId = productModel.PostId,
                Title = productModel.Title,
                Url = productModel.Url,
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
            product.Url = productModel.Url;
            product.Description = productModel.Description;

            _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteProductByIdAsync(int productId)
        {
            var productToUpdate = await _unitOfWork.Products.GetByIdAsync(productId);

            if (productToUpdate == null)
                return false;

            _unitOfWork.Products.DeleteAsync(productToUpdate);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteProductByAdvAsync(int advId)
        {
            var products = await _unitOfWork.Products.GetAsync();
            var fillterdProuct = products.Where(p => p.PostId == advId).ToList();

            if (fillterdProuct == null || !fillterdProuct.Any())
                return false;

            foreach (var product in fillterdProuct)
            {
                _unitOfWork.Products.DeleteAsync(product);
            }

            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task DeleteProductForDeleteAdvAsync(int advId)
        {
            var products = await _unitOfWork.Products.GetAsync();
            var fillterdProuct = products.Where(p => p.PostId == advId).ToList();

            if (fillterdProuct == null || !fillterdProuct.Any())
                return;

            foreach (var product in fillterdProuct)
            {
                _unitOfWork.Products.DeleteAsync(product);
            }

            await _unitOfWork.SaveAsync();
            return;
        }

        public async Task<int> CountProductAsync(int shopId)
        {
            var advs = await _unitOfWork.Advs.GetAsync();
            if (advs == null || !advs.Any())
                return 0;

            var fillteredAdvs = advs.Where(a => a.ShopId == shopId);
            if (fillteredAdvs == null || !fillteredAdvs.Any())
                return 0;

            var advIds = fillteredAdvs.Select(a => a.Id).ToList();
            var products = await _unitOfWork.Products.GetAsync();

            var fillteredProduct = products.Where(p => advIds.Contains(p.PostId));

            return fillteredProduct.Count();

        }

    }
}
