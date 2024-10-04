using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;

namespace SWP391.KoiCareSystemAtHome.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WaterReportController : ControllerBase
    {
        private readonly WaterReportService _waterReportService;

        public WaterReportController(WaterReportService waterReportService)
        {
            _waterReportService = waterReportService;
        }

        [HttpGet("waterReport/{pondId}")]
        public async Task<ActionResult<IEnumerable<WaterReportResponseModel>>> GetWaterReportByPondId(int pondId)
        {
            var waterReports = await _waterReportService.GetWarterReportByPondIdAsync(pondId);

            if (waterReports == null || !waterReports.Any()) 
                return NotFound();

            var response = waterReports.Select(waterReport => new WaterReportResponseModel
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
                Nitrates = waterReport.Nitrates,
                Nitrite = waterReport.Nitrite,
                Amonium = waterReport.Amonium,
            });

            return Ok(response);
        }

        [HttpPost("waterReport")]
        public async Task<ActionResult<WaterReportResponseModel>> GetWaterReportById(WaterReportRequestModel request)
        {
            var waterReports = await _waterReportService.GetWarterReportByPondIdAsync(request.PondId);

            if (waterReports == null || !waterReports.Any())
                return NotFound();

            var waterReport = waterReports.Where(w => w.Id == request.WaterReportId).FirstOrDefault();
            if (waterReport == null) 
                return NotFound();

            var response = new WaterReportResponseModel
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
                Nitrates = waterReport.Nitrates,
                Nitrite = waterReport.Nitrite,
                Amonium = waterReport.Amonium,
            };

            return Ok(response);
        }
    }
}
