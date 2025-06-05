using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private readonly ISpecializationRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public SpecializationController(ISpecializationRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }


        [HttpGet("get-paged")]
        public IActionResult Search([FromQuery] string? keyword, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            var results = _res.GetPaged(keyword, pageIndex, pageSize);
            return Ok(results);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var specialization = _res.GetById(id);
            if (specialization == null)
            {
                return NotFound();
            }
            return Ok(specialization);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Specialization specialization)
        {
            if (specialization == null)
            {
                return BadRequest();
            }

            _res.Create(specialization);
            return CreatedAtAction(nameof(GetById), new { id = specialization.Id }, specialization);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Specialization specialization)
        {
            if (specialization == null || specialization.Id != id)
            {
                return BadRequest();
            }

            var existingSpecialization = _res.GetById(id);
            if (existingSpecialization == null)
            {
                return NotFound();
            }

            _res.Update(specialization);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var specialization = _res.GetById(id);
            if (specialization == null)
            {
                return NotFound();
            }

            _res.Delete(id);
            return NoContent();
        }

       
    }
}
