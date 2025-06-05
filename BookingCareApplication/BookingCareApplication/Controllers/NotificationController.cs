using BookingCareApplication.Data.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {

        private readonly INotificationRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public NotificationController(INotificationRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("get-reexamination-notification")]
        public IActionResult GetSchedules([FromQuery] string patient_email)
        {
            try
            {
                var res = _res.GetReExaminationRecords2(patient_email);

                //if (res == null || !res.Any())
                //{
                //    return NotFound(new { Message = "No schedules found for the specified criteria." });
                //}

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
