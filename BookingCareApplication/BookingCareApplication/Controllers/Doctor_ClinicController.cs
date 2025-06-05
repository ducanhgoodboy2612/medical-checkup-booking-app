using BookingCareApplication.Data.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Doctor_ClinicController : ControllerBase
    {
        private readonly IDoctor_ClinicRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public Doctor_ClinicController(IDoctor_ClinicRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("get-by-doctorid/{doctorId}")]
        public IActionResult GetByDoctorId(int doctorId)
        {
            try
            {
                var res = _res.GetClinicsByDoctorId(doctorId);

                if (res == null)
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
    }
}
