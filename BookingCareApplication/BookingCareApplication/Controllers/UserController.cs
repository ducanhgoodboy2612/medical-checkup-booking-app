using BookingCareApplication.Data.Interface;
using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;
using BookingCareApplication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepo _res;
        private readonly UserService _userService;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public UserController(IUserRepo res, UserService userService, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _userService = userService;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                string email = null;
                if (formData.ContainsKey("email") && formData["email"] != null)
                {
                    email = formData["email"].ToString();
                }

                string password = null;
                if (formData.ContainsKey("password") && formData["password"] != null)
                {
                    password = formData["password"].ToString();
                }

                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                {
                    return BadRequest("Email and password are required.");
                }

                var user = _userService.Login(email, password);

                if (user == null)
                    return Unauthorized(new { message = "Username or password is incorrect" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message, // Thông báo lỗi
                    details = ex.StackTrace // Chi tiết stack trace của lỗi
                });
            }
        }

        [Route("get-paged")]
        [HttpPost]
        public IActionResult GetPagedUsers([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int pageIndex = int.Parse(formData["page"].ToString());
                int pageSize = int.Parse(formData["pageSize"].ToString());

                string? name = null;
                if (formData.ContainsKey("name") && formData["name"] != null)
                {
                    name = formData["name"].ToString();
                }

                string? email = null;
                if (formData.ContainsKey("email") && formData["email"] != null)
                {
                    email = formData["email"].ToString();
                }

                int totalRecords;
                var results = _res.GetPagedUsers(name, email, pageIndex, pageSize, out totalRecords);

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
                return BadRequest(new
                {
                    Message = "An error occurred while processing your request.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("get-by-id")]
        public IActionResult GetUserById([FromQuery] int userId)
        {
            try
            {
                var res = _res.GetById(userId);

                if (res == null)
                {
                    return NotFound(new { Message = "No user found for the specified criteria." });
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [Route("create-user")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserDetailsDto request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }

            try
            {
                _res.CreateUser(request); // Giả định hàm này sẽ tự động gán ID
                return Ok("User created successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while creating the user");
            }
        }

        [Route("update-user")]
        [HttpPut]
        public IActionResult UpdateUser([FromBody] UserDetailsDto request)
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

                _res.UpdateUser(request);
                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                // Handle error (log it or return appropriate error response)
                return StatusCode(500, "An error occurred while updating the user");
            }
        }

    }
}
