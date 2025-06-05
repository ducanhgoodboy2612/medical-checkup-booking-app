using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookingCareApplication.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientRepo _res;
        private readonly string _path;
        private readonly IWebHostEnvironment _env;

        public PatientController(IPatientRepo res, IConfiguration configuration, IWebHostEnvironment env)
        {
            _res = res;
            _path = configuration["AppSettings:PATH"];
            _env = env;
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var patient = _res.GetById(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        [Route("get-paged")]
        [HttpPost]
        public IActionResult GetPagedPatients([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int pageIndex = int.Parse(formData["page"].ToString());
                int pageSize = int.Parse(formData["pageSize"].ToString());

                int? doctorId = null;
                if (formData.ContainsKey("doctorId") && formData["doctorId"] != null)
                {
                    doctorId = int.Parse(formData["doctorId"].ToString());
                }

                string? name = null;
                if (formData.ContainsKey("name") && formData["name"] != null)
                {
                    name = formData["name"].ToString();
                }

                string? phone = null;
                if (formData.ContainsKey("phone") && formData["phone"] != null)
                {
                    phone = formData["phone"].ToString();
                }

                string? dateBooking = null;
                if (formData.ContainsKey("dateBooking") && formData["dateBooking"] != null)
                {
                    dateBooking = formData["dateBooking"].ToString();
                }

                // Gọi hàm GetPagedPatients từ service layer
                int totalRecords;
                var results = _res.GetPaged(doctorId, name, phone, dateBooking, pageIndex, pageSize, out totalRecords);

                // Trả về kết quả
                return Ok(new { TotalRecords = totalRecords, Patients = results });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần thiết
                return BadRequest("An error occurred while processing your request.");
            }
        }


        [HttpGet("get-appointment")]
        public IActionResult GetAllAppointment([FromQuery] string? email, [FromQuery] int doctorId)
        {
            try
            {
                var res = _res.GetAppointment(email, doctorId);

                if (res == null || !res.Any())
                {
                    return NotFound(new { Message = "No appointment found for the specified criteria." });
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }

        [HttpPost]
        [Route("create-patient")]

        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdPatient = await _res.Create(patient);
            return Ok(createdPatient);
        }

        // PUT: api/patient/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != patient.Id)
            {
                return BadRequest(new { Message = "Patient ID mismatch" });
            }

            try
            {
                var updatedPatient = await _res.Update(patient);
                return Ok(updatedPatient);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        // DELETE: api/patient/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var success = await _res.Delete(id);
            if (!success)
            {
                return NotFound(new { Message = "Patient not found" });
            }

            return NoContent();
        }

        [HttpPut("upd-status")]
        public IActionResult UpdatePatient([FromBody] Dictionary<string, object> formData)
        {
            try
            {
                int patientId = int.Parse(formData["patientId"].ToString());
                int? statusId = null;
                if (formData.ContainsKey("statusId") && formData["statusId"] != null && formData["statusId"].ToString() != "")
                {
                    statusId = int.Parse(formData["statusId"].ToString());
                }

                bool? isSentForms = null;
                if (formData.ContainsKey("isSentForms") && formData["isSentForms"] != null && formData["isSentForms"].ToString() != "")
                {
                    isSentForms = bool.Parse(formData["isSentForms"].ToString());
                }

                bool? isTakeCare = null;
                if (formData.ContainsKey("isTakeCare") && formData["isTakeCare"] != null && formData["isTakeCare"].ToString() != "")
                {
                    isTakeCare = bool.Parse(formData["isTakeCare"].ToString());
                }

                _res.UpdatePatientStatus(patientId, statusId, isSentForms, isTakeCare);
                return Ok(new { message = "Patient updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpGet("patient-statistics")]
        public IActionResult GetPatientStatistics()
        {
            try
            {
                var statistics = _res.GetPatientCount();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("total-patients-year")]
        public IActionResult GetTotalPatientsInYear()
        {
            var totalPatients = _res.GetTotalPatientInCurrentYear();
            return Ok(totalPatients);
        }

        [HttpGet("total-patients-month")]
        public IActionResult GetTotalPatientsInMonth()
        {
            var totalPatients = _res.GetTotalPatientInCurrentMonth();
            return Ok(totalPatients);
        }
    }
}
