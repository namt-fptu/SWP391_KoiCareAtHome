using SWP391.KoiCareSystemAtHome.Repository;
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

        //public async Task<PondModel> GetPondByIdAsync(int pondId, int ownerId)
        //{
        //    var ponds = await _unitOfWork.Ponds.GetAsync();
        //    var pondsOfOwner = ponds.Where(p => p.PondOwnerId == ownerId);

        //    if (!pondsOfOwner.Any())
        //        return null;



        //}
    }
}
