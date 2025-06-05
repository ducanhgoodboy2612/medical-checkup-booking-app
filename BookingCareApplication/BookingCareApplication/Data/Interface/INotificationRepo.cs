using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface INotificationRepo
    {
        IEnumerable<(bool ReExamination, int DoctorId, MedicalRecord MedicalRecord)> GetReExaminationRecords(string patient_email);

        IEnumerable<ReExaminationRecordDto> GetReExaminationRecords2(string patient_email);
    }
}
