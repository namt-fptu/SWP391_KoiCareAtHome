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

            var koiGrowthReportModels = reportOfKois.Select(r => new KoiGrowthReportModel
            {
                Id = r.Id,
                KoiId = r.KoiId,
                Date = r.Date,
                Length = r.Length,
                Wetight = r.Length
            });

            return koiGrowthReportModels;
        }

        public async Task<KoiGrowthReportModel> GetKoiGrowthReportByIdAsync(int reportId)
        {
            var koiGrowthReports = await _unitOfWork.KoiGrowthReports.GetAsync();

            var koiGrowReport = koiGrowthReports.FirstOrDefault(r => r.Id == reportId);

            if (koiGrowReport == null)
                return null;

            var koiGrowthReportModel = new KoiGrowthReportModel
            {
                Id = koiGrowReport.Id,
                KoiId = koiGrowReport.KoiId,
                Date = koiGrowReport.Date,
                Length = koiGrowReport.Length,
                Wetight = koiGrowReport.Length
            };

            return koiGrowthReportModel;
        }

        public async Task<int> CreateKoiGrowthReportAsync(KoiGrowthReportModel koiGrowthReportModel)
        {
            var entity = new KoiGrowthReport
            {
                KoiId = koiGrowthReportModel.KoiId,
                Date = koiGrowthReportModel.Date,
                Length = koiGrowthReportModel.Length,
                Wetight = koiGrowthReportModel.Length
            };

            await _unitOfWork.KoiGrowthReports.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Id;
        }

    }
}
