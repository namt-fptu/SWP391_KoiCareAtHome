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

            return waterReportEntity.PondId;
        }
    }
}
