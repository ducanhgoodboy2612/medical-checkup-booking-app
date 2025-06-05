using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IMedicalRecordRepo
    {
        IEnumerable<MedicalRecord> GetByPatientId(int patientId, int doctorId);
        void CreateRecord(MedicalRecord model);
    }
}
