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
        private readonly KoiFishService _koiFishService;
        private readonly WaterReportService _waterReportService;

        public PondService(UnitOfWork unitOfWork, KoiFishService koiFishService, WaterReportService waterReportService)
        {
            _unitOfWork = unitOfWork;
            _koiFishService = koiFishService;
            _waterReportService = waterReportService;
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
                ImageUrl = pond.ImageUrl,
                PumpingCapacity = pond.PumpingCapacity
            });

            return pondModels;
        }

        public async Task<PondModel?> GetPondByIdAsync(int pondId)
        {
            var ponds = await _unitOfWork.Ponds.GetAsync();

            var pond = ponds.FirstOrDefault(p => p.Id == pondId);

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
                ImageUrl = pond.ImageUrl,
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
                ImageUrl = pondModel.ImageUrl,
                PumpingCapacity = pondModel.PumpingCapacity
            };

            await _unitOfWork.Ponds.InsertAsync(pondEntity);
            await _unitOfWork.SaveAsync();

            return pondEntity.Id;
        }

        public async Task<bool> UpdatePondAsync(int pondId, PondModel pondModel)
        {
            var pond = await _unitOfWork.Ponds.GetByIdAsync(pondId);

            if (pond == null)
                return false;

            pond.Name = pondModel.Name;
            pond.Depth = pondModel.Depth;
            pond.Volume = pondModel.Volume;
            pond.DraimCount = pondModel.DraimCount;
            pond.SkimmerCount = pondModel.SkimmerCount;
            pond.ImageUrl = pondModel.ImageUrl;
            pond.PumpingCapacity = pondModel.PumpingCapacity;

            _unitOfWork.Ponds.UpdateAsync(pond);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeletePondAsync(int pondId)
        {
            var pond = await _unitOfWork.Ponds.GetByIdAsync(pondId);
            if (pond == null)
                return false;

            bool deleteKoiFishs = false;
            deleteKoiFishs = await _koiFishService.DeleteKoiByPondIdAsync(pondId);
            bool deleteWaterReports = false;
            deleteWaterReports = await _waterReportService.DeleteWaterReportAsync(pondId);

            //if (!deleteKoiFishs || !deleteWaterReports)
            //    return false;

            _unitOfWork.Ponds.DeleteAsync(pond);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeletePondByOwnerIdAsync(int ownerID)
        {
            var ponds = await _unitOfWork.Ponds.GetAsync();
            if (ponds == null || !ponds.Any())
                return false;

            var fillteredPonds = ponds.Where(p => p.PondOwnerId == ownerID).ToList();
            if (fillteredPonds == null || !fillteredPonds.Any())
                return false;

            foreach (var entity in fillteredPonds)
            {
                bool success = await DeletePondAsync(entity.Id);
                //if (!success)
                //    return false;
            }

            return true;
        }

        public async Task<IEnumerable<PondModel>> SearchPondOfOwnerByPondNameAsync(int id, string name)
        {
            var ponds = await _unitOfWork.Ponds.GetAsync();
            var pondsOfOwner = ponds.Where(p => p.PondOwnerId == id);
            pondsOfOwner = pondsOfOwner.Where(p => p.Name.Contains(name, StringComparison.OrdinalIgnoreCase));

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
                ImageUrl = pond.ImageUrl,
                PumpingCapacity = pond.PumpingCapacity
            });

            return pondModels;
        }

    }
}
