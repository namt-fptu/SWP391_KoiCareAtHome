using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.KoiCareSystemAtHome.API.RequestModel;
using SWP391.KoiCareSystemAtHome.API.ResponseModel;
using SWP391.KoiCareSystemAtHome.Service.Services;
using SWP391.KoiCareSystemAtHome.Service.BusinessModels;
using SWP391.KoiCareSystemAtHome.Repository.Models;
using Microsoft.Data.SqlClient;

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

        [HttpGet("waterReportId/{reportId}")]
        public async Task<ActionResult<WaterReportResponseModel>> GetWaterReportById(int reportId)
        {

            var waterReport = await _waterReportService.GetWarterReportByIdAsync(reportId);

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

        [HttpPost("createWaterReport")]
        public async Task<ActionResult> CreateWaterReport(WaterReportRequestModel request)
        {
            if (request == null)
                return BadRequest("Water Report data is required");

            try
            {
                WaterReportModel model = new()
                {
                    PondId = request.PondId,
                    Temperature = request.Temperature,
                    PhVaule = request.PhVaule,
                    Hardness = request.Hardness,
                    Oxigen = request.Oxigen,
                    Cabondioxide = request.Cabondioxide,
                    Salt = request.Salt,
                    Date = request.Date,
                    Nitrates = request.Nitrates,
                    Nitrite = request.Nitrite,
                    Amonium = request.Amonium
                };

                int waterReportId = await _waterReportService.CreateWaterReportAsync(model);    //bug in get id

                var waterReport = await _waterReportService.GetWarterReportByIdAsync(waterReportId);

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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the water report.");
            }
        }

        [HttpPut("updateWaterReport/{id}")]
        public async Task<ActionResult> UpdateWaterReport(int id, WaterreportUpdateRequestModel reqest)
        {
            var waterreport = await _waterReportService.GetWarterReportByIdAsync(id);
            if (waterreport == null)
                return NotFound();

            try
            {
                waterreport.Temperature = reqest.Temperature;
                waterreport.PhVaule = reqest.PhVaule;
                waterreport.Hardness = reqest.Hardness;
                waterreport.Oxigen = reqest.Oxigen;
                waterreport.Cabondioxide = reqest.Cabondioxide;
                waterreport.Salt = reqest.Salt;
                waterreport.Date = reqest.Date;
                waterreport.Nitrates = reqest.Nitrates;
                waterreport.Nitrite = reqest.Nitrite;
                waterreport.Amonium = reqest.Amonium;

                bool success = await _waterReportService.UpdateWaterReportAsync(id, waterreport);
                if (!success)
                {
                    return NotFound();
                }

                var waterReport = await _waterReportService.GetWarterReportByIdAsync(id);

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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the water report.");
            }
        }

        [HttpDelete("deleteWaterReports/{pondId}")]
        public async Task<ActionResult> DeleteWaterReport(int pondId)
        {
            bool success = await _waterReportService.DeleteWaterReportAsync(pondId);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("deleteWaterReportById/{id}")]
        public async Task<ActionResult> DeleteWaterReportReportById(int id)
        {
            bool success = await _waterReportService.DeleteWaterReportByIdAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("getWaterStatistic/{pondId}")]
        public async Task<ActionResult> GetWaterStatisticByPondId(int pondId)
        {
            var waterStatisticModels = await _waterReportService.GetWaterStatisticsByPondIdAsync(pondId);
            if (waterStatisticModels == null || !waterStatisticModels.Any())
                return NotFound();

            var response = waterStatisticModels.Select(w => new WaterStatisticResponseModel
            {
                Date = w.Date,
                MaxTemp = w.MaxTemp,
                MinTemp = w.MinTemp,
                MaxPh = w.MaxPh,
                MinPh = w.MinPh,
                MaxHardness = w.MaxHardness,
                MinHardness = w.MinHardness,
                MaxOxigen = w.MaxOxigen,
                MinOxigen = w.MinOxigen,
                MaxCabondioxide = w.MaxCabondioxide,
                MinCabondioxide = w.MinCabondioxide,
                MaxSalt = w.MaxSalt,
                MinSalt = w.MinSalt,
                MaxNitrates = w.MaxNitrates,
                MinNitrates = w.MinNitrates,
                MaxNitrite = w.MaxNitrite,
                MinNitrite = w.MinNitrite,
                MaxAmonium = w.MaxAmonium,
                MinAmonium = w.MinAmonium,

                Temperature = w.Temperature,
                PhVaule = w.PhVaule,
                Hardness = w.Hardness,
                Oxigen = w.Oxigen,
                Cabondioxide = w.Cabondioxide,
                Salt = w.Salt,
                Nitrates = w.Nitrates,
                Nitrite = w.Nitrite,
                Amonium = w.Amonium,
            });

            return Ok(response);
        }

    }
}
