using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public ScheduleController(IScheduleRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("GetSchedules")]
        public IActionResult GetSchedules([FromQuery] int? doctorId, [FromQuery] string? date)
        {
            try
            {
                var schedules = _res.GetSchedules(doctorId, date);

                if (schedules == null || !schedules.Any())
                {
                    return NotFound(new { Message = "No schedules found for the specified criteria." });
                }

                return Ok(schedules);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [HttpGet("get-by-id")]
        public IActionResult GetScheduleById([FromQuery] int scheduleId)
        {
            try
            {
                var schedule = _res.GetById(scheduleId);

                if (schedule == null)
                {
                    return NotFound(new { Message = "No schedules found for the specified criteria." });
                }

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [Route("create-schedule")]
        [HttpPost]
        public IActionResult CreateSchedule([FromBody] Schedule request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.CreateSchedule(
                    request
                );

                return Ok("Schedule created successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while creating the schedule");
            }
        }

        [Route("create-schedules")]
        [HttpPost]
        public IActionResult CreateSchedule([FromBody] List<Schedule> schedules)
        {
            if (schedules == null || schedules.Count == 0)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                foreach (var schedule in schedules)
                {
                    _res.CreateSchedule(schedule);
                }

                return Ok("Schedules created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("DeleteSchedules")]
        public IActionResult DeleteSchedules([FromQuery] int doctorId, [FromQuery] string? date)
        {
            try
            {
                var del = _res.DeleteSchedules(doctorId, date);

                if (del == false)
                {
                    return NotFound(new { Message = "No schedules found for the specified criteria." });
                }

                return Ok(del);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }


    }
}
