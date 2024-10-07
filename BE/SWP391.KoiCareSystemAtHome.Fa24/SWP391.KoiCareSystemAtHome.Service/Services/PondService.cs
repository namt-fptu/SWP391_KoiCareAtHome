using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class PondService
    {
        private readonly UnitOfWork _unitOfWork;

        public PondService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<PondModel>> GetPondByOwnerIdAsync(int id)
        {
            var ponds = await _unitOfWork.Ponds.GetAsync();
            var pondsOfOwner = ponds.Where(p => p.PondOwnerId == id);

            if (!pondsOfOwner.Any())
                return Enumerable.Empty<PondModel>();

            var pondModels = pondsOfOwner.Select(pond => new PondModel
            {
                Id = pond.Id,
                PondOwnerId = pond.PondOwnerId,
                Name = pond.Name,
                Depth = pond.Depth,
                Volume = pond.Volume,
                DraimCount = pond.DraimCount,
                SkimmerCount = pond.SkimmerCount,
                PumpingCapacity = pond.PumpingCapacity
            });

            return pondModels;
        }

        public async Task<PondModel> GetPondByIdAsync(int pondId, int ownerId)
        {
            var ponds = await _unitOfWork.Ponds.GetAsync();
            var pondsOfOwner = ponds.Where(p => p.PondOwnerId == ownerId);

            if (pondsOfOwner == null || !pondsOfOwner.Any())
                return null;

            var pond = pondsOfOwner.FirstOrDefault(p => p.Id == pondId);

            if (pond == null)
                return null;

            var pondModels = new PondModel
            {
                Id = pond.Id,
                PondOwnerId = pond.PondOwnerId,
                Name = pond.Name,
                Depth = pond.Depth,
                Volume = pond.Volume,
                DraimCount = pond.DraimCount,
                SkimmerCount = pond.SkimmerCount,
                PumpingCapacity = pond.PumpingCapacity
            };

            return pondModels;
        }

        public async Task<int> CreatePondAsync(PondModel pondModel)
        {
            var pondEntity = new Pond
            {
                PondOwnerId = pondModel.PondOwnerId,
                Name = pondModel.Name,
                Depth = pondModel.Depth,
                Volume = pondModel.Volume,
                DraimCount = pondModel.DraimCount,
                SkimmerCount = pondModel.SkimmerCount,
                PumpingCapacity = pondModel.PumpingCapacity
            };

            await _unitOfWork.Ponds.InsertAsync(pondEntity);
            await _unitOfWork.SaveAsync();

            return pondEntity.Id;
        }

    }
}
