using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Data.Repository
{
    public class Doctor_ClinicRepo : IDoctor_ClinicRepo
    {
        private readonly BookingcareContext _context;

        public Doctor_ClinicRepo(BookingcareContext context)
        {
            _context = context;
        }

        //public List<DoctorClinic> GetByDoctorId(int doctorId)
        //{
        //    return _context.DoctorClinics.Where(dc => dc.DoctorId == doctorId).ToList();
        //}

        public IEnumerable<dynamic> GetClinicsByDoctorId(int doctorId)
        {
            var doctorClinics = from dc in _context.DoctorClinics
                                join c in _context.Clinics
                                on dc.ClinicId equals c.Id
                                where dc.DoctorId == doctorId
                                select new 
                                {
                                    dc.Id,
                                    dc.DoctorId,
                                    dc.ClinicId,
                                    dc.Status,
                                    dc.Notes,
                                    dc.CreatedAt,
                                    dc.UpdatedAt,
                                    
                                    ClinicName = c.Name,   
                                    ClinicPhone = c.Phone   
                                };

            return doctorClinics.ToList(); // Convert to list and return
        }

        // 2. Create new record
        public void Create(DoctorClinic doctorClinic)
        {
            _context.DoctorClinics.Add(doctorClinic);
            _context.SaveChanges();  
        }

        // 3. Delete a record by id
        public void Delete(int id)
        {
            var doctorClinic = _context.DoctorClinics.FirstOrDefault(dc => dc.Id == id);
            if (doctorClinic != null)
            {
                _context.DoctorClinics.Remove(doctorClinic);
                _context.SaveChanges();  
            }
        }

    }
}
