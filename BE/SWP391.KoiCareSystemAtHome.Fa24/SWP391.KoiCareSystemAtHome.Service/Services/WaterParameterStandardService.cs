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
    public class WaterParameterStandardService
    {
        private UnitOfWork _unitOfWork;

        public WaterParameterStandardService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<WaterParameterStandardModel>> GetAllWaterParameterStandardsAsync()
        {
            var waterParameterStandards = await _unitOfWork.WaterParameterStandards.GetAsync();

            if (waterParameterStandards == null || !waterParameterStandards.Any())
                return Enumerable.Empty<WaterParameterStandardModel>();

            var waterParameterStandardModels = waterParameterStandards.Select(p => new WaterParameterStandardModel
            {
                Id = p.Id,
                KoiVariety = p.KoiVariety,
                MaxTemp = p.MaxTemp,
                MinTemp = p.MinTemp,
                MaxPh = p.MaxPh,
                MinPh = p.MinPh,
                MaxHardness = p.MaxHardness,
                MinHardness = p.MinHardness,
                MaxOxigen = p.MaxOxigen,
                MinOxigen = p.MinOxigen,
                MaxCabondioxide = p.MaxCabondioxide,
                MinCabondioxide = p.MinCabondioxide,
                MaxSalt = p.MaxSalt,
                MinSalt = p.MinSalt,
                MaxNitrates = p.MaxNitrates,
                MinNitrates = p.MinNitrates,
                MaxAmonium = p.MaxAmonium,
                MinAmonium = p.MinAmonium,
                MaxNitrite = p.MaxNitrite,
                MinNitrite = p.MinNitrite
            });

            return waterParameterStandardModels;
        }

        public async Task<WaterParameterStandardModel> GetWaterParameterStandardByVarietyAsync(string variety)
        {
            var waterParameterStandards = await _unitOfWork.WaterParameterStandards.GetAsync();

            if (waterParameterStandards == null || !waterParameterStandards.Any())
                return null;

            var waterParameterStandard = waterParameterStandards.FirstOrDefault(p => p.KoiVariety.Equals(variety, StringComparison.OrdinalIgnoreCase));

            if (waterParameterStandard == null)
                return null;

            var waterParameterStandardModel = new WaterParameterStandardModel
            {
                Id = waterParameterStandard.Id,
                KoiVariety = waterParameterStandard.KoiVariety,
                MaxTemp = waterParameterStandard.MaxTemp,
                MinTemp = waterParameterStandard.MinTemp,
                MaxPh = waterParameterStandard.MaxPh,
                MinPh = waterParameterStandard.MinPh,
                MaxHardness = waterParameterStandard.MaxHardness,
                MinHardness = waterParameterStandard.MinHardness,
                MaxOxigen = waterParameterStandard.MaxOxigen,
                MinOxigen = waterParameterStandard.MinOxigen,
                MaxCabondioxide = waterParameterStandard.MaxCabondioxide,
                MinCabondioxide = waterParameterStandard.MinCabondioxide,
                MaxSalt = waterParameterStandard.MaxSalt,
                MinSalt = waterParameterStandard.MinSalt,
                MaxNitrates = waterParameterStandard.MaxNitrates,
                MinNitrates = waterParameterStandard.MinNitrates,
                MaxAmonium = waterParameterStandard.MaxAmonium,
                MinAmonium = waterParameterStandard.MinAmonium,
                MaxNitrite = waterParameterStandard.MaxNitrite,
                MinNitrite = waterParameterStandard.MinNitrite
            };

            return waterParameterStandardModel;
        }
    }
}
