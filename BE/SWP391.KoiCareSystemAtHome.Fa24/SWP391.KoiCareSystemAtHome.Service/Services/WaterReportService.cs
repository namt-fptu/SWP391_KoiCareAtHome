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
    public class WaterReportService
    {
        private readonly UnitOfWork _unitOfWork;

        public WaterReportService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<WaterReportModel>> GetWarterReportByPondIdAsync(int pondId)
        {
            var waterReports = await _unitOfWork.WaterReports.GetAsync();
            var reportOfPond = waterReports.Where(w => w.PondId == pondId);

            if (reportOfPond == null || !reportOfPond.Any()) 
                return Enumerable.Empty<WaterReportModel>();

            var waterReportModels = reportOfPond.Select(w => new WaterReportModel
            {
                Id = w.Id,
                PondId = w.PondId,
                Temperature = w.Temperature,
                PhVaule = w.PhVaule,
                Hardness = w.Hardness,
                Oxigen = w.Oxigen,
                Cabondioxide = w.Cabondioxide,
                Salt = w.Salt,
                Date = w.Date,
                Nitrite = w.Nitrite,
                Nitrates = w.Nitrates,
                Amonium = w.Amonium
            });
            return waterReportModels;
        }

        public async Task<WaterReportModel> GetWarterReportByIdAsync (int reportId)
        {
            var waterReports = await _unitOfWork.WaterReports.GetAsync();

            var waterReport = waterReports.FirstOrDefault(p => p.Id == reportId);

            if (waterReport == null)
                return null;

            var waterReportModel = new WaterReportModel
            {
                Id = waterReport.Id,
                PondId = waterReport.PondId,
                Temperature = waterReport.Temperature,
                PhVaule = waterReport.PhVaule,
                Hardness = waterReport.Hardness,
                Oxigen = waterReport.Oxigen,
                Cabondioxide = waterReport.Cabondioxide,
                Salt = waterReport.Salt,
                Date = waterReport.Date,
                Nitrite = waterReport.Nitrite,
                Nitrates = waterReport.Nitrates,
                Amonium = waterReport.Amonium
            };

            return waterReportModel;
        }

        public async Task<int> CreateWaterReportAsync(WaterReportModel waterReportModel)
        {
            var waterReportEntity = new WaterReport
            {
                PondId = waterReportModel.PondId,
                Temperature = waterReportModel.Temperature,
                PhVaule = waterReportModel.PhVaule,
                Hardness = waterReportModel.Hardness,
                Oxigen = waterReportModel.Oxigen,
                Cabondioxide = waterReportModel.Cabondioxide,
                Salt = waterReportModel.Salt,
                Date = waterReportModel.Date,
                Nitrates = waterReportModel.Nitrates,
                Nitrite = waterReportModel.Nitrite,
                Amonium = waterReportModel.Amonium
            };

            await _unitOfWork.WaterReports.InsertAsync(waterReportEntity);
            await _unitOfWork.SaveAsync();

            return waterReportEntity.Id;
        }

        public async Task<bool> UpdateWaterReportAsync(int waterReportId, WaterReportModel waterReportModel)
        {
            var report = await _unitOfWork.WaterReports.GetByIdAsync(waterReportId);

            if (report == null) 
                return false;

            report.Temperature = waterReportModel.Temperature;
            report.PhVaule = waterReportModel.PhVaule;
            report.Hardness = waterReportModel.Hardness;
            report.Oxigen = waterReportModel.Oxigen;
            report.Cabondioxide = waterReportModel.Cabondioxide;
            report.Salt = waterReportModel.Salt;
            report.Date = waterReportModel.Date;
            report.Nitrates = waterReportModel.Nitrates;
            report.Nitrite = waterReportModel.Nitrite;
            report.Amonium = waterReportModel.Amonium;

            _unitOfWork.WaterReports.UpdateAsync(report);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteWaterReportAsync(int pondId)
        {
            var waterReports = await _unitOfWork.WaterReports.GetAsync();

            var fillteredReports = waterReports.Where(w => w.PondId == pondId).ToList();

            if (!fillteredReports.Any()) 
                return false;

            foreach (var entity in fillteredReports)
            {
                _unitOfWork.WaterReports.DeleteAsync(entity);
            }

            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteWaterReportByIdAsync(int id)
        {
            var waterReports = await _unitOfWork.WaterReports.GetAsync();

            var waterReport = waterReports.FirstOrDefault(p => p.Id == id);

            if (waterReport == null)
                return false;

            _unitOfWork.WaterReports.DeleteAsync(waterReport);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<WaterStatisticModel>> GetWaterStatisticsByPondIdAsync(int pondId)
        {
            var waterReports = await _unitOfWork.WaterReports.GetAsync();
            var reportOfPond = waterReports.Where(r => r.PondId == pondId).ToList();

            if (reportOfPond == null || !reportOfPond.Any())
                return Enumerable.Empty<WaterStatisticModel>();

            var waterReportStandards = await _unitOfWork.WaterParameterStandards.GetAsync();
            var fillteredWaterReportStandard = waterReportStandards.FirstOrDefault(r => r.KoiVariety == "General");

            if (fillteredWaterReportStandard == null)
                return Enumerable.Empty<WaterStatisticModel>();

            var waterSatisticModels = reportOfPond.Select(r => new WaterStatisticModel
            {
                Date = r.Date,
                MaxTemp = fillteredWaterReportStandard.MaxTemp,
                MinTemp = fillteredWaterReportStandard.MinTemp,
                MaxPh = fillteredWaterReportStandard.MaxPh,
                MinPh = fillteredWaterReportStandard.MinPh,
                MaxHardness = fillteredWaterReportStandard.MaxHardness,
                MinHardness = fillteredWaterReportStandard.MinHardness,
                MaxOxigen = fillteredWaterReportStandard.MaxOxigen,
                MinOxigen = fillteredWaterReportStandard.MinOxigen,
                MaxCabondioxide = fillteredWaterReportStandard.MaxCabondioxide,
                MinCabondioxide = fillteredWaterReportStandard.MinCabondioxide,
                MaxSalt = fillteredWaterReportStandard.MaxSalt,
                MinSalt = fillteredWaterReportStandard.MinSalt,
                MaxNitrates = fillteredWaterReportStandard.MaxNitrates,
                MinNitrates = fillteredWaterReportStandard.MinNitrates,
                MaxNitrite = fillteredWaterReportStandard.MaxNitrite,
                MinNitrite = fillteredWaterReportStandard.MinNitrite,
                MaxAmonium = fillteredWaterReportStandard.MaxAmonium,
                MinAmonium = fillteredWaterReportStandard.MinAmonium,

                Temperature = r.Temperature,
                PhVaule = r.PhVaule,
                Hardness = r.Hardness,
                Oxigen = r.Oxigen,
                Cabondioxide = r.Cabondioxide,
                Salt = r.Salt,
                Nitrates = r.Nitrates,
                Nitrite = r.Nitrite,
                Amonium = r.Amonium,
            }).OrderBy(w => w.Date).ToList();

            return waterSatisticModels;
        }

    }
}
