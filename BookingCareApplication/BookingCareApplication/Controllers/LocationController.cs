using BookingCareApplication.Data.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public LocationController(ILocationRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("GetLocation")]
        public IActionResult GetLocation([FromQuery] string? keyword)
        {
            try
            {
                var res = _res.GetByName(keyword);

                if (res == null || !res.Any())
                {
                    return NotFound(new { Message = "No location found for the specified criteria." });
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
