using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMedicalRecordRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public MedicalRecordController(IMedicalRecordRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("getRecord")]
        public IActionResult GetMedicalRecord([FromQuery] int patientId, [FromQuery] int doctorId)
        {
            try
            {
                var res = _res.GetByPatientId(patientId, doctorId);

                if (res == null || !res.Any())
                {
                    return NotFound(new { Message = "No schedules found for the specified criteria." });
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [Route("create-record")]
        [HttpPost]
        public IActionResult CreateRecord([FromBody] MedicalRecord request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.CreateRecord(
                    request
                );

                return Ok("Created successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while creating the schedule");
            }
        }
    }
}
