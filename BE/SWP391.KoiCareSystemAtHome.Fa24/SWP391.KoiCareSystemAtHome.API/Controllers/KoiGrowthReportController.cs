using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Service.Services;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KoiGrowthReportController : ControllerBase
    {
        private readonly KoiGrowthReportService _koiGrowthReportService;

        public KoiGrowthReportController(KoiGrowthReportService koiGrowthReportService)
        {
            _koiGrowthReportService = koiGrowthReportService;
        }

        [HttpGet("koiGrowthReport/{koiId}")]
        public async Task<ActionResult<IEnumerable<KoiFishResponseModel>>> GetKoiGrowthReportByKoiId(int koiId)
        {
            var reports = await _koiGrowthReportService.GetKoiGrowthReportByKoiIdAsync(koiId);

            if (reports == null || !reports.Any()) 
                return NotFound();

            var response = reports.Select(r => new KoiGrowthReportResponseModel
            {
                Id = r.Id,
                KoiId = r.KoiId,
                Stage = r.Stage,
                Date = r.Date,
                Length = r.Length,
                Weight = r.Weight,
            });

            return Ok(response);
        }

        [HttpGet("koiGrowthReportId/{reportId}")]
        public async Task<ActionResult<KoiGrowthReportResponseModel>> GetKoiGrowthReportById(int reportId)
        {
            var report = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(reportId);

            if (report == null)
                return NotFound();

            var response = new KoiGrowthReportResponseModel
            {
                Id = report.Id,
                KoiId = report.KoiId,
                Stage = report.Stage,
                Date = report.Date,
                Length = report.Length,
                Weight = report.Weight,
            };
            return Ok(response);
        }

        [HttpPost("createKoiReport")]
        public async Task<ActionResult> CreateKoiGrowthReport(KoiGrowthReportRequestModel request)
        {
            if (request == null)
                return BadRequest("Koi growth report data is required.");
            try
            {
                KoiGrowthReportModel model = new()
                {
                    KoiId = request.KoiId,
                    Date = request.Date,
                    Length = request.Length,
                    Weight = request.Wetight
                };

                int koiReportId = await _koiGrowthReportService.CreateKoiGrowthReportAsync(model);

                var report = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(koiReportId);

                if (report == null)
                    return NotFound();

                var response = new KoiGrowthReportResponseModel
                {
                    Id = report.Id,
                    KoiId = report.KoiId,
                    Date = report.Date,
                    Length = report.Length,
                    Weight = report.Weight,
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the koi growth report.");
            }
        }

        [HttpPut("updateKoiGrowthreport/{id}")]
        public async Task<ActionResult> UpdateKoiGrowthReport(int id, KoiGrowthReportUpdateModel request)
        {
            var koiGrowthReport = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(id);

            if (koiGrowthReport == null)
                return NotFound();

            try
            {
                koiGrowthReport.Date = request.Date;
                koiGrowthReport.Weight = request.Wetight;
                koiGrowthReport.Length = request.Length;

                bool success = await _koiGrowthReportService.UpdateKoiGrowReportAsync(id ,koiGrowthReport);
                if (!success)
                    return NotFound();

                var report = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(id);

                if (report == null)
                    return NotFound();

                var response = new KoiGrowthReportResponseModel
                {
                    Id = report.Id,
                    KoiId = report.KoiId,
                    Stage = report.Stage,
                    Date = report.Date,
                    Length = report.Length,
                    Weight = report.Weight,
                };
                return Ok(response);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the koi growth report.");
            }
        }

        [HttpDelete("deleteGrowthreport/{koiId}")]
        public async Task<ActionResult> DeleteKoiGrowthreport(int koiId)
        {
            bool success = await _koiGrowthReportService.DeleteKoiGrowthReportAsync(koiId);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("deleteGrowthreportById/{id}")]
        public async Task<ActionResult> DeleteKoiGrowthreportById(int id)
        {
            bool success = await _koiGrowthReportService.DeleteKoiGrowthReportByIdAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("getKoiStatistic/{koiId}")]
        public async Task<ActionResult> GetKoiGrowthStatistics(int koiId)
        {
            var koiStatistic = await _koiGrowthReportService.GetKoiGrowthSatisticByKoiIdAsync(koiId);

            if (koiStatistic == null || !koiStatistic.Any())
                return NotFound();

            var response = koiStatistic.Select(s => new KoiStatisticResponseModel
            {
                Stage = s.Stage,
                Length = s.Length,
                Weight = s.Weight,
                MaxLength = s.MaxLength,
                MinLength = s.MinLength,
                MaxWeight = s.MaxWeigth,
                MinWeight = s.MinWeigth,
            });

            return Ok(response);
        }

    }
}
