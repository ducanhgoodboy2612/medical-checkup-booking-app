using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Data.Repository
{
    public class NotificationRepo : INotificationRepo
    {
        private readonly BookingcareContext _context;

        public NotificationRepo(BookingcareContext context)
        {
            _context = context;
        }
        public IEnumerable<(bool ReExamination, int DoctorId, MedicalRecord MedicalRecord)> GetReExaminationRecords(string patient_email)
        {
            var currentDate = DateOnly.FromDateTime(DateTime.Now);

            var results = (from record in _context.MedicalRecords
                           join patient in _context.Patients
                           on record.PatientId equals patient.Id
                           where patient.Email == patient_email
                           && record.ReExaminationDate.HasValue
                           && currentDate >= record.ReExaminationDate.Value.AddDays(-7) 
                           && currentDate <= record.ReExaminationDate.Value.AddDays(7)
                           select new
                           {
                               ReExamination = true,
                               patient.DoctorId,
                               MedicalRecord = record
                           }).ToList();

            // Trả về tất cả các bản ghi hợp lệ
            return results.Select(r => (r.ReExamination, r.DoctorId, r.MedicalRecord));
        }


        public IEnumerable<ReExaminationRecordDto> GetReExaminationRecords2(string patient_email)
        {
            var currentDate = DateOnly.FromDateTime(DateTime.Now);

            var results = (from record in _context.MedicalRecords
                           join patient in _context.Patients
                           on record.PatientId equals patient.Id
                           where patient.Email == patient_email
                           && record.ReExaminationDate.HasValue
                           && currentDate >= record.ReExaminationDate.Value.AddDays(-7)
                           && currentDate <= record.ReExaminationDate.Value.AddDays(7)
                           select new ReExaminationRecordDto
                           {
                               ReExamination = true,
                               DoctorId = patient.DoctorId,

                           }).ToList();

            return results;
        }
    }

    public class ReExaminationRecordDto
    {
        public bool ReExamination { get; set; }
        public int DoctorId { get; set; }
        // Chỉ trả về các thông tin cần thiết (không chứa MedicalRecord)
    }


    

}
