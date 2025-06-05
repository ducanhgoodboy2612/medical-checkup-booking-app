using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Repository
{
    public class PatientRepo : IPatientRepo
    {
        private readonly BookingcareContext _context;

        public PatientRepo(BookingcareContext context)
        {
            _context = context;
        }
        public Patient GetById(int id)
        {
            return _context.Patients.FirstOrDefault(s => s.Id == id);
        }

        public IEnumerable<Patient> GetAppointment(string email, int doctorId)
        {
            var patients = _context.Patients
                            .Where(p => (p.Email == email || p.DoctorId == doctorId) && p.DeletedAt == null)
                            .OrderByDescending(p => p.Id)
                            .ToList();

            return patients;
        }

        //public IEnumerable<dynamic> GetAppointment(string email, int doctorId)
        //{
        //    var query = from p in _context.Patients
        //                join s in _context.Schedules on new { DoctorId = p.DoctorId, Date = p.DateBooking }
        //                                             equals new { DoctorId = s.DoctorId, Date = s.Date } into schedules
        //                from schedule in schedules.DefaultIfEmpty() // Left join
        //                join c in _context.Clinics on schedule.ClinicId equals c.Id into clinics
        //                from clinic in clinics.DefaultIfEmpty() // Left join
        //                where p.Email == email && p.DoctorId == doctorId && p.DeletedAt == null
        //                select new
        //                {
        //                    PatientId = p.Id,
        //                    p.Name,
        //                    p.Phone,
        //                    p.DateBooking,
        //                    p.TimeBooking,
        //                    p.Email,
        //                    DoctorId = p.DoctorId,
        //                    ScheduleId = schedule != null ? schedule.Id : (int?)null,
        //                    ScheduleDate = schedule.Date,
        //                    ScheduleTime = schedule.Time,
        //                    MaxBooking = schedule.MaxBooking,
        //                    SumBooking = schedule.SumBooking,
        //                    ClinicId = clinic != null ? clinic.Id : (int?)null,
        //                    ClinicName = clinic.Name,
        //                    ClinicAddress = clinic.Address,
        //                    ClinicPhone = clinic.Phone
        //                };

        //    return query.ToList();
        //}




        public IEnumerable<Patient> GetPaged(int? doctorId, string? name, string? phone, string? dateBooking, int pageIndex, int pageSize, out int total)
        {
            var query = _context.Patients.AsQueryable();

            // Lọc dữ liệu
            if (doctorId.HasValue)
            {
                query = query.Where(p => p.DoctorId == doctorId.Value);
            }
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.Name.Contains(name));
            }
            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(p => p.Phone.Contains(phone));
            }
            if (!string.IsNullOrEmpty(dateBooking))
            {
                query = query.Where(p => p.DateBooking == dateBooking);
            }

            total = query.Count();

            var pagedQuery = query.OrderByDescending(p => p.Id).Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return pagedQuery.ToList();
        }


        // Add new patient
        public async Task<Patient> Create(Patient patient)
        {
            patient.CreatedAt = DateTime.UtcNow;  
            _context.Patients.Add(patient);       // Add patient to DbSet
            await _context.SaveChangesAsync();    // Save changes to database
            return patient;
        }

        // Update existing patient
        public async Task<Patient> Update(Patient patient)
        {
            var existingPatient = await _context.Patients.FindAsync(patient.Id);
            if (existingPatient == null)
            {
                throw new ArgumentException("Patient not found");
            }

            existingPatient.Name = patient.Name;
            existingPatient.Phone = patient.Phone;
            existingPatient.DateBooking = patient.DateBooking;
            existingPatient.TimeBooking = patient.TimeBooking;
            existingPatient.Email = patient.Email;
            existingPatient.Gender = patient.Gender;
            existingPatient.Year = patient.Year;
            existingPatient.Address = patient.Address;
            existingPatient.Description = patient.Description;
            existingPatient.StatusId = patient.StatusId;
            existingPatient.IsSentForms = patient.IsSentForms;
            existingPatient.IsTakeCare = patient.IsTakeCare;
            existingPatient.UpdatedAt = DateTime.UtcNow;  

            _context.Patients.Update(existingPatient);   
            await _context.SaveChangesAsync();            // Save changes to database

            return existingPatient;
        }

        // Delete patient by id
        public async Task<bool> Delete(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return false;
            }

            patient.DeletedAt = DateTime.UtcNow;  // Soft delete 
            _context.Patients.Update(patient);    

            // _context.Patients.Remove(patient); 

            await _context.SaveChangesAsync();    // Save changes to database
            return true;
        }

        public void UpdatePatientStatus(int id, int? statusId, bool? isSentForms, bool? isTakeCare)
        {
            var patient = _context.Patients.FirstOrDefault(p => p.Id == id);

            if (patient == null)
            {
                throw new ArgumentException($"No patient found with ID: {id}");
            }

            if (statusId.HasValue)
            {
                patient.StatusId = statusId.Value;
            }

            if (isSentForms.HasValue)
            {
                patient.IsSentForms = isSentForms.Value;
            }

            if (isTakeCare.HasValue)
            {
                patient.IsTakeCare = isTakeCare.Value;
            }

            _context.Patients.Update(patient); 
            _context.SaveChanges(); 
        }

        public IEnumerable<dynamic> GetPatientCount()
        {
            return _context.Patients
                .Where(p => !string.IsNullOrEmpty(p.DateBooking)) // Lọc các ngày null
                .AsEnumerable() // Chuyển sang client-side evaluation
                .Select(p =>
                {
                    var format = "ddd MMM dd yyyy"; // Định dạng tương ứng với 'Fri Sep 06 2024'
                    DateTime parsedDate = DateTime.ParseExact(p.DateBooking, format, System.Globalization.CultureInfo.InvariantCulture);
                    return new { Year = parsedDate.Year, Month = parsedDate.Month };
                })
                .GroupBy(p => new { p.Year, p.Month }) // Nhóm theo năm và tháng
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(result => result.Year)
                .ThenBy(result => result.Month)
                .ToList();
        }

        public int GetTotalPatientInCurrentYear()
        {
            var currentYear = DateTime.Now.Year;

            var totalPatients = _context.Patients
                .Where(p => !string.IsNullOrEmpty(p.DateBooking)) 
                .AsEnumerable() // Chuyển sang client-side evaluation
                .Select(p =>
                {
                    var format = "ddd MMM dd yyyy"; // Định dạng ngày ví dụ 'Fri Sep 06 2024'
                    DateTime parsedDate;
                    if (DateTime.TryParseExact(p.DateBooking, format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out parsedDate))
                    {
                        return parsedDate; // Trả về DateTime đã được phân tích
                    }

                    return (DateTime?)null; 
                })
                .Where(p => p.HasValue && p.Value.Year == currentYear) 
                .Count(); 

            return totalPatients;
        }

        public int GetTotalPatientInCurrentMonth()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var totalPatients = _context.Patients
                .Where(p => !string.IsNullOrEmpty(p.DateBooking))
                .AsEnumerable()
                .Select(p =>
                {
                    var format = "ddd MMM dd yyyy";
                    DateTime parsedDate;

                    if (DateTime.TryParseExact(p.DateBooking, format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out parsedDate))
                    {
                        return parsedDate;
                    }

                    return (DateTime?)null;
                })
                .Where(p => p.HasValue && p.Value.Year == currentYear && p.Value.Month == currentMonth)
                .Count();

            return totalPatients;
        }

    }
}
