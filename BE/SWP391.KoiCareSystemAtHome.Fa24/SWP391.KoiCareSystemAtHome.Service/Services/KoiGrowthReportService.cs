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

            var koiFish = await _unitOfWork.KoiFishs.GetByIdAsync(id);

            if (koiFish == null || koiFish.Dob == null)
                return Enumerable.Empty<KoiGrowthReportModel>();

            var koiGrowthReportModels = reportOfKois.Select(r =>
            {
                var dob = koiFish.Dob.Value;
                var reportDate = r.Date;

                int stageInMonths = ((reportDate.Year - dob.Year) * 12) + reportDate.Month - dob.Month;

                if (reportDate.Day < dob.Day)
                {
                    stageInMonths--;
                }

                return new KoiGrowthReportModel
                {
                    Id = r.Id,
                    KoiId = r.KoiId,
                    Stage = stageInMonths,
                    Date = r.Date,
                    Length = r.Length,
                    Weight = r.Wetight,
                };
            });

            return koiGrowthReportModels;
        }

        public async Task<KoiGrowthReportModel> GetKoiGrowthReportByIdAsync(int reportId)
        {
            var koiGrowthReports = await _unitOfWork.KoiGrowthReports.GetAsync();

            var koiGrowReport = koiGrowthReports.FirstOrDefault(r => r.Id == reportId);

            if (koiGrowReport == null)
                return null;

            var koiFish = await _unitOfWork.KoiFishs.GetByIdAsync(koiGrowReport.KoiId);

            int stageInMonths = 0;
            if (koiFish != null && koiFish.Dob != null)
            {
                var dob = koiFish.Dob.Value;
                var reportDate = koiGrowReport.Date;

                stageInMonths = ((reportDate.Year - dob.Year) * 12) + reportDate.Month - dob.Month;

                if (reportDate.Day < dob.Day)
                {
                    stageInMonths--;
                }
            }

            var koiGrowthReportModel = new KoiGrowthReportModel
            {
                Id = koiGrowReport.Id,
                KoiId = koiGrowReport.KoiId,
                Date = koiGrowReport.Date,
                Stage = stageInMonths,
                Length = koiGrowReport.Length,
                Weight = koiGrowReport.Wetight
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
                Wetight = koiGrowthReportModel.Weight,
            };

            await _unitOfWork.KoiGrowthReports.InsertAsync(entity);
            await _unitOfWork.SaveAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateKoiGrowReportAsync(int reportId, KoiGrowthReportModel koiGrowthReportModel)
        {
            var report = await _unitOfWork.KoiGrowthReports.GetByIdAsync(reportId);
            if (report == null) 
                return false;

            report.Date = koiGrowthReportModel.Date;
            report.Length = koiGrowthReportModel.Length;
            report.Wetight = koiGrowthReportModel.Weight;

            _unitOfWork.KoiGrowthReports.UpdateAsync(report);
            await _unitOfWork.SaveAsync();

            return true;
        }

        public async Task<bool> DeleteKoiGrowthReportAsync(int koiId)
        {
            var koiGrowthReports = await _unitOfWork.KoiGrowthReports.GetAsync();

            var fillteredReports = koiGrowthReports.Where(g => g.KoiId == koiId).ToList();

            if (!fillteredReports.Any())
                return false;

            foreach (var entity in fillteredReports)
            {
                _unitOfWork.KoiGrowthReports.DeleteAsync(entity);
            }

            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<KoiStatisticModel>> GetKoiGrowthSatisticByKoiIdAsync(int id)
        {
            var koiGrowthReports = await _unitOfWork.KoiGrowthReports.GetAsync();
            var reportOfKois = koiGrowthReports.Where(r => r.KoiId == id).ToList();

            if (reportOfKois == null || !reportOfKois.Any())
                return Enumerable.Empty<KoiStatisticModel>();

            var koiFish = await _unitOfWork.KoiFishs.GetByIdAsync(id);

            if (koiFish?.Dob == null)
                return Enumerable.Empty<KoiStatisticModel>();

            var koiGrowthStandards = await _unitOfWork.KoiGrowthStandards.GetAsync();
            var filteredKoiGrowthStandards = koiGrowthStandards
                .Where(s => (s.KoiVariety == koiFish.KoiVariety))
                .ToDictionary(s => s.Stage);

            if (!filteredKoiGrowthStandards.Any())
            {
                filteredKoiGrowthStandards = koiGrowthStandards
                    .Where(s => s.KoiVariety == "General")
                    .ToDictionary(s => s.Stage);
            }

            var koiGrowthReportModels = reportOfKois.Select(r =>
            {
                var dob = koiFish.Dob.Value;
                var reportDate = r.Date;

                int stageInMonths = ((reportDate.Year - dob.Year) * 12) + (reportDate.Month - dob.Month);
                if (reportDate.Day < dob.Day)
                {
                    stageInMonths--;
                }

                return new KoiGrowthReportModel
                {
                    Id = r.Id,
                    KoiId = r.KoiId,
                    Stage = stageInMonths,
                    Date = r.Date,
                    Length = r.Length,
                    Weight = r.Wetight
                };
            });

            var koiStatisticModels = koiGrowthReportModels.Select(s =>
            {
                var model = new KoiStatisticModel
                {
                    Stage = s.Stage,
                    Length = s.Length,
                    Weight = s.Weight,
                    MaxLength = 0,
                    MinLength = 0,
                    MaxWeigth = 0,
                    MinWeigth = 0,
                };

                if (filteredKoiGrowthStandards.TryGetValue(s.Stage, out var koiGrowthStandard))
                {
                    model.MaxLength = koiGrowthStandard.MaxLength;
                    model.MinLength = koiGrowthStandard.MinLength;
                    model.MaxWeigth = koiGrowthStandard.MaxWeigth;
                    model.MinWeigth = koiGrowthStandard.MinWeigth;
                }

                return model;
            });

            return koiStatisticModels;
        }

        public async Task<bool> DeleteKoiGrowthReportByIdAsync(int id)
        {
            var koiGrowthReport = await _unitOfWork.KoiGrowthReports.GetByIdAsync(id);

            if (koiGrowthReport == null)
                return false;

            _unitOfWork.KoiGrowthReports.DeleteAsync(koiGrowthReport);

            await _unitOfWork.SaveAsync();
            return true;
        }

    }
}
