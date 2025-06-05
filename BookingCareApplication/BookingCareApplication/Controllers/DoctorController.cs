using BookingCareApplication.Data.Interface;
using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private IDoctorRepo _res;
        private string _path;
        private IWebHostEnvironment _env;
        public DoctorController(IDoctorRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }


        //[HttpGet("get-paged")]
        //public IActionResult Search(
        //[FromQuery] int? specializationId,
        //[FromQuery] int? titleId,
        //[FromQuery] string? name,
        //[FromQuery] int pageIndex = 1,
        //[FromQuery] int pageSize = 10)
        //{
        //    var results = _res.GetPaged(specializationId, titleId, name, pageIndex, pageSize);
        //    return Ok(results);
        //}

        [Route("get-paged")]
        [HttpPost]
        public IActionResult GetPaged([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int pageIndex = int.Parse(formData["page"].ToString());

                int pageSize = int.Parse(formData["pageSize"].ToString());

                int? specializationId = null;
                if (formData.ContainsKey("specializationId") && formData["specializationId"] != null)
                {
                    specializationId = int.Parse(formData["specializationId"].ToString());
                }

                int? titleId = null;
                if (formData.ContainsKey("titleId") && formData["titleId"] != null)
                {
                    titleId = int.Parse(formData["titleId"].ToString());
                }

                string? name = null;
                if (formData.ContainsKey("name") && formData["name"] != null)
                {
                    name = formData["name"].ToString();
                }

                int totalRecords;

                var results = _res.GetPaged(specializationId, titleId, name, pageIndex, pageSize, out totalRecords);
                return Ok(new
                {
                    TotalItems = totalRecords,
                    Data = results,
                    Page = pageIndex,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                
                return BadRequest("An error occurred while processing your request.");
            }
        }


        [Route("get-paged-v2")]
        [HttpPost]
        public IActionResult GetPaged_v2([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int pageIndex = int.Parse(formData["page"].ToString());
                int pageSize = int.Parse(formData["pageSize"].ToString());

                int? specializationId = null;
                if (formData.ContainsKey("specializationId") && formData["specializationId"] != null)
                {
                    specializationId = int.Parse(formData["specializationId"].ToString());
                }

                int? titleId = null;
                if (formData.ContainsKey("titleId") && formData["titleId"] != null && int.Parse(formData["titleId"].ToString()) != 0)
                {
                    titleId = int.Parse(formData["titleId"].ToString());
                }

                string? name = null;
                if (formData.ContainsKey("name") && formData["name"] != null)
                {
                    name = formData["name"].ToString();
                }

                string? address = null;
                if (formData.ContainsKey("address") && formData["address"] != null)
                {
                    address = formData["address"].ToString();
                }

                int? PriceSorted = null;
                if (formData.ContainsKey("priceSorted") && formData["priceSorted"] != null)
                {
                    PriceSorted = int.Parse(formData["priceSorted"].ToString());
                }

                int totalRecords;

                var results = _res.GetPaged2(specializationId, titleId, name, address, PriceSorted, pageIndex, pageSize, out totalRecords);

                return Ok(new
                {
                    TotalItems = totalRecords,
                    Data = results,
                    Page = pageIndex,
                    PageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về phản hồi xấu
                return BadRequest("An error occurred while processing your request.");
            }
        }



        [Route("get-top")]
        [HttpPost]
        public IActionResult GetDoctorsSortedByPatientBooking([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int pageIndex = int.Parse(formData["page"].ToString());

                int pageSize = int.Parse(formData["pageSize"].ToString());

                int? specializationId = null;
                if (formData.ContainsKey("specializationId") && formData["specializationId"] != null)
                {
                    specializationId = int.Parse(formData["specializationId"].ToString());
                }

                int? titleId = null;
                if (formData.ContainsKey("titleId") && formData["titleId"] != null)
                {
                    titleId = int.Parse(formData["titleId"].ToString());
                }

                string? name = null;
                if (formData.ContainsKey("name") && formData["name"] != null)
                {
                    name = formData["name"].ToString();
                }

                var results = _res.GetDoctorsSortedByPatientBooking(specializationId, titleId, name, pageIndex, pageSize);
                return Ok(results);
            }
            catch (Exception ex)
            {

                return BadRequest("An error occurred while processing your request.");
            }
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

        [HttpGet("TotalPatientsGroupedByDoctor")]
        public IActionResult GetTotalPatientsGroupedByDoctor()
        {
            try
            {
                var result = _res.GetTotalPatientsGroupedByDoctor();
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log exception (ex) here if needed
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }




        [Route("get-paged-doctors-by-patient-count")]
        [HttpPost]
        public IActionResult GetPagedDoctorsByPatientCount([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                var page = int.Parse(formData["page"].ToString());
                var pageSize = int.Parse(formData["pageSize"].ToString());
                int? specializationId = null;
                if (formData.Keys.Contains("specializationId") && formData["specializationId"] != null && formData["specializationId"].ToString() != "")
                {
                    specializationId = int.Parse(formData["specializationId"].ToString());
                }
                int? titleId = null;
                if (formData.Keys.Contains("titleId") && formData["titleId"] != null && formData["titleId"].ToString() != "")
                {
                    titleId = int.Parse(formData["titleId"].ToString());
                }
                string? name = null;
                if (formData.Keys.Contains("name") && formData["name"] != null && formData["name"].ToString() != "")
                {
                    name = Convert.ToString(formData["name"]);
                }

                var results = _res.GetPagedDoctorsByPatientCount(specializationId, titleId, name, page, pageSize);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing your request.");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> CreateUser([FromForm] IFormFile avatarFile)
        {
            if (avatarFile == null || avatarFile.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            try
            {
                string imageUrl = await _res.UploadImage(avatarFile);

                return Ok(imageUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    

    [Route("create-doctor")]
        [HttpPost]
        public IActionResult CreateDoctor2([FromBody] DoctorDetailModel request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.CreateDoctor(request);
                return Ok("User created successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while creating the user");
            }
        }

        [Route("create-doctor12")]
        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromForm] DoctorDetailModel request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request: missing data");
            }

            try
            {
                // Gọi đến phương thức repo và truyền avatarFile
                //await _res.CreateDoctor2(request, avatarFile);
                return Ok("User created successfully");
            }
            catch (Exception ex)
            {
                // Log error và trả về mã lỗi phù hợp
                return StatusCode(500, $"An error occurred while creating the user: {ex.Message}");
            }
        }



        [Route("update-doctor")]
        [HttpPut]
        public IActionResult UpdateDoctor([FromBody] DoctorDetailModel request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                //var existingUser = _res.GetById(id);
                //if (existingUser == null)
                //{
                //    return NotFound("User not found");
                //}

                _res.UpdateDoctor(request);
                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while updating the user");
            }
        }

        [Route("delete-doctor/{id}")]
        [HttpDelete]
        public IActionResult DeleteDoctor(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid clinic ID");
            }

            try
            {
                _res.DeleteDoctor(id);
                return Ok("Doctor deleted successfully");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi (ghi log hoặc trả về thông báo lỗi phù hợp)
                return StatusCode(500, "An error occurred while deleting the clinic");
            }
        }
    }
}
