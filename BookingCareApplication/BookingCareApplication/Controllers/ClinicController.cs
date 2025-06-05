using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static BookingCareApplication.Data.ClinicRepo;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClinicController : ControllerBase
    {
        private IClinicRepo _res;
        private string _path;
        private IWebHostEnvironment _env;
        public ClinicController(IClinicRepo bus, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = bus;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        //private readonly BookingcareContext _context;
        //public ClinicController(BookingcareContext context)
        //{
        //    _context = context;
        //}

        [HttpGet]
        public IActionResult getAll()
        {
            return Ok(_res.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _res.GetById(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [Route("get-paged")]
        [HttpPost]
        public IActionResult GetPaged([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                string key_name = "";
                if (formData.Keys.Contains("key_name") && !string.IsNullOrEmpty(Convert.ToString(formData["key_name"]))) { key_name = Convert.ToString(formData["key_name"]); }
                string? address = null;
                if (formData.Keys.Contains("address") && formData["address"] != null && formData["address"].ToString() != "")
                {
                    address = Convert.ToString(formData["address"]);

                }

                int totalRecords;
                var results = _res.GetPaged(key_name, address, page, pageSize, out totalRecords);
                return Ok(new
                {
                    TotalItems = totalRecords,
                    Data = results,
                    Page = page,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing your request.");
            }
        }

        [HttpGet("get-by-doctorId/{doctorId}")]
        public IActionResult GetAllAppointment(int doctorId)
        {
            try
            {
                var res = _res.GetByDoctorId(doctorId);

                if (res == null || !res.Any())
                {
                    return NotFound(new { Message = "No clinic found for the specified criteria." });
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [Route("create-clinic")]
        [HttpPost]
        public IActionResult CreateClinic([FromBody] ClinicDetailModel request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.CreateClinic(request);  
                return Ok("Clinic created successfully");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi (ghi log hoặc trả về thông báo lỗi phù hợp)
                return StatusCode(500, "An error occurred while creating the clinic");
            }
        }

        [Route("update-clinic")]
        [HttpPut]
        public IActionResult UpdateClinic([FromBody] ClinicDetailModel request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.UpdateClinic(request);  
                return Ok("Clinic updated successfully");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi (ghi log hoặc trả về thông báo lỗi phù hợp)
                return StatusCode(500, "An error occurred while updating the clinic");
            }
        }

        [Route("delete-clinic/{id}")]
        [HttpDelete]
        public IActionResult DeleteClinic(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid clinic ID");
            }

            try
            {
                _res.DeleteClinic(id);  
                return Ok("Clinic deleted successfully");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi (ghi log hoặc trả về thông báo lỗi phù hợp)
                return StatusCode(500, "An error occurred while deleting the clinic");
            }
        }

    }
}
