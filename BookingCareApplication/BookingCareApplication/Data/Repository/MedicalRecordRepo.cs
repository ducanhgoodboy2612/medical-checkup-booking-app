using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Repository
{
    public class MedicalRecordRepo : IMedicalRecordRepo
    {
        private readonly BookingcareContext _context;

        public MedicalRecordRepo(BookingcareContext context)
        {
            _context = context;
        }
        public IEnumerable<MedicalRecord>  GetByPatientId(int patientId, int doctorId)
        {
            if(doctorId != 0)
            {
                return (from record in _context.MedicalRecords
                        join patient in _context.Patients
                        on record.PatientId equals patient.Id
                        where record.PatientId == patientId && patient.DoctorId == doctorId
                        select record).ToList();
            }
            return (from record in _context.MedicalRecords
                    join patient in _context.Patients
                    on record.PatientId equals patient.Id
                    where record.PatientId == patientId
                    select record).ToList();
        }

        public void CreateRecord(MedicalRecord model)
        {
            var medicalRecord = new MedicalRecord
            {
                PatientId = model.PatientId,
                Height = model.Height,
                Weight = model.Weight,
                HeartRate = model.HeartRate,
                Temperature = model.Temperature,
                GeneralConclusion = model.GeneralConclusion,
                DiseaseProgressStatus = model.DiseaseProgressStatus,
                ReExaminationDate = model.ReExaminationDate,
                CreatedAt = DateTime.Now 
            };

            _context.MedicalRecords.Add(medicalRecord);
            var patient = _context.Patients.FirstOrDefault(p => p.Id == model.PatientId);
            if (patient != null)
            {
                patient.StatusId = 5;
            }

            _context.SaveChanges();
        }

    }
}
