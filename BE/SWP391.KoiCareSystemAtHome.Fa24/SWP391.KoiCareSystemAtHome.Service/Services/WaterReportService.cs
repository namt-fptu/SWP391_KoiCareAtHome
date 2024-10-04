using SWP391.KoiCareSystemAtHome.Repository;
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

            if (reportOfPond.Any()) 
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
    }
}
