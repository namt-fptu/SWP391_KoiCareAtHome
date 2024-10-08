using SWP391.KoiCareSystemAtHome.Repository;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.KoiCareSystemAtHome.Service.Services
{
    public class KoiGrowthReportService
    {
        private readonly UnitOfWork _unitOfWork;

        public KoiGrowthReportService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<KoiGrowthReportModel>> GetKoiGrowthReportByKoiIdAsync(int id)
        {
            var koiGrowthReports = await _unitOfWork.KoiGrowthReports.GetAsync();
            var reportOfKois = koiGrowthReports.Where(r => r.KoiId == id);

            if (reportOfKois == null || !reportOfKois.Any())
                return Enumerable.Empty<KoiGrowthReportModel>();

            var koiGrowthReportModel = reportOfKois.Select(r => new KoiGrowthReportModel
            {
                Id = r.Id,
                KoiId = r.KoiId,
                Date = r.Date,
                Length = r.Length,
                Wetight = r.Length
            });

            return koiGrowthReportModel;
        }
    }
}
