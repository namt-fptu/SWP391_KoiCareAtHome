﻿using SWP391.KoiCareSystemAtHome.Repository;
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

        public async Task<WaterParameterStandardModel?> GetWaterParameterStandardByVarietyAsync(int id)
        {
            var waterParameterStandards = await _unitOfWork.WaterParameterStandards.GetAsync();

            if (waterParameterStandards == null || !waterParameterStandards.Any())
                return null;

            var waterParameterStandard = waterParameterStandards.FirstOrDefault(p => p.Id == id);

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

        public async Task<int> CreateWaterParameterStandardAsync(WaterParameterStandardModel waterParameterStandardModel)
        {
            var entity = new WaterParameterStandard
            {
                Id = waterParameterStandardModel.Id,
                KoiVariety = waterParameterStandardModel.KoiVariety,
                MaxTemp = waterParameterStandardModel.MaxTemp,
                MinTemp = waterParameterStandardModel.MinTemp,
                MaxPh = waterParameterStandardModel.MaxPh,
                MinPh = waterParameterStandardModel.MinPh,
                MaxHardness = waterParameterStandardModel.MaxHardness,
                MinHardness = waterParameterStandardModel.MinHardness,
                MaxOxigen = waterParameterStandardModel.MaxOxigen,
                MinOxigen = waterParameterStandardModel.MinOxigen,
                MaxCabondioxide = waterParameterStandardModel.MaxCabondioxide,
                MinCabondioxide = waterParameterStandardModel.MinCabondioxide,
                MaxSalt = waterParameterStandardModel.MaxSalt,
                MinSalt = waterParameterStandardModel.MinSalt,
                MaxNitrates = waterParameterStandardModel.MaxNitrates,
                MinNitrates = waterParameterStandardModel.MinNitrates,
                MaxAmonium = waterParameterStandardModel.MaxAmonium,
                MinAmonium = waterParameterStandardModel.MinAmonium,
                MaxNitrite = waterParameterStandardModel.MaxNitrite,
                MinNitrite = waterParameterStandardModel.MinNitrite
            };

            await _unitOfWork.WaterParameterStandards.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateWaterStandard(int id, WaterParameterStandardModel waterParameterStandardModel)
        {
            var waterParameterStandards = await _unitOfWork.WaterParameterStandards.GetAsync();

            var waterParameterStandard = waterParameterStandards.FirstOrDefault(p => p.Id == id);

            if (waterParameterStandard == null)
                return false;

            waterParameterStandard.MaxTemp = waterParameterStandardModel.MaxTemp;
            waterParameterStandard.MinTemp = waterParameterStandardModel.MinTemp;
            waterParameterStandard.MaxPh = waterParameterStandardModel.MaxPh;
            waterParameterStandard.MinPh = waterParameterStandardModel.MinPh;
            waterParameterStandard.MaxHardness = waterParameterStandardModel.MaxHardness;
            waterParameterStandard.MinHardness = waterParameterStandardModel.MinHardness;
            waterParameterStandard.MaxOxigen = waterParameterStandardModel.MaxOxigen;
            waterParameterStandard.MinOxigen = waterParameterStandardModel.MinOxigen;
            waterParameterStandard.MaxCabondioxide = waterParameterStandardModel.MaxCabondioxide;
            waterParameterStandard.MinCabondioxide = waterParameterStandardModel.MinCabondioxide;
            waterParameterStandard.MaxSalt = waterParameterStandardModel.MaxSalt;
            waterParameterStandard.MinSalt = waterParameterStandardModel.MinSalt;
            waterParameterStandard.MaxNitrates = waterParameterStandardModel.MaxNitrates;
            waterParameterStandard.MinNitrates = waterParameterStandardModel.MinNitrates;
            waterParameterStandard.MaxNitrite = waterParameterStandardModel.MaxNitrite;
            waterParameterStandard.MinNitrates = waterParameterStandardModel.MinNitrite;
            waterParameterStandard.MaxAmonium = waterParameterStandardModel.MaxAmonium;
            waterParameterStandard.MinAmonium = waterParameterStandardModel.MinAmonium;

            _unitOfWork.WaterParameterStandards.UpdateAsync(waterParameterStandard);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteWaterParameterStandardAsync (int id)
        {
            var waterParameterStandard = await _unitOfWork.WaterParameterStandards.GetByIdAsync(id);

            if (waterParameterStandard == null) 
                return false;

            _unitOfWork.WaterParameterStandards.DeleteAsync(waterParameterStandard);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task DeleteWaterStandardByVarietyAsync(string variety)
        {
            var waterStandards = await _unitOfWork.WaterParameterStandards.GetAsync();
            var fillteredWaterStandard = waterStandards.Where(w => w.KoiVariety.Equals(variety));

            if (fillteredWaterStandard == null || !fillteredWaterStandard.Any())
                return;

            foreach (var item in fillteredWaterStandard)
            {
                _unitOfWork.WaterParameterStandards.DeleteAsync(item);
            }

            await _unitOfWork.SaveAsync();
            return;
        }

    }
}
