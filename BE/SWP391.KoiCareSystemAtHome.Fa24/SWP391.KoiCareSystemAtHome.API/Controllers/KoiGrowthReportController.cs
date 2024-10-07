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

        [HttpGet("koiGrowReport/{koiId}")]
        public async Task<ActionResult<IEnumerable<KoiFishResponseModel>>> GetKoiGrowthReportByKoiId(int koiId)
        {
            var reports = await _koiGrowthReportService.GetKoiGrowthReportByKoiIdAsync(koiId);

            if (reports == null || !reports.Any()) 
                return NotFound();

            var response = reports.Select(r => new KoiGrowthReportResponseModel
            {
                Id = r.Id,
                KoiId = r.KoiId,
                Date = r.Date,
                Length = r.Length,
                Wetight = r.Wetight,
            });

            return Ok(response);
        }

        [HttpPost("koiGrowReport")]
        public async Task<ActionResult<KoiGrowthReportResponseModel>> GetKoiGrowReportById(GetKoiGrowthReportRequestModel request)
        {
            var report = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(request.KoiId, request.KoiGrowthReportId);

            if (report == null)
                return NotFound();

            var response = new KoiGrowthReportResponseModel
            {
                Id = report.Id,
                KoiId = report.KoiId,
                Date = report.Date,
                Length = report.Length,
                Wetight = report.Wetight,
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
                    Wetight = request.Length
                };

                int koiReportId = await _koiGrowthReportService.CreateKoiGrowthReportAsync(model);

                var report = await _koiGrowthReportService.GetKoiGrowthReportByIdAsync(request.KoiId, koiReportId);

                if (report == null)
                    return NotFound();

                var response = new KoiGrowthReportResponseModel
                {
                    Id = report.Id,
                    KoiId = report.KoiId,
                    Date = report.Date,
                    Length = report.Length,
                    Wetight = report.Wetight,
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the koi growth report.");
            }
        }
    }
}
