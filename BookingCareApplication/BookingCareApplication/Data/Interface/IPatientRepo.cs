using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IPatientRepo
    {
        Patient GetById(int id);
        IEnumerable<Patient> GetAppointment(string email, int doctorId);
        //IEnumerable<dynamic> GetAppointment(string email, int doctorId);
        IEnumerable<Patient> GetPaged(int? doctorId, string? name, string? phone, string? dateBooking, int pageIndex, int pageSize, out int total);
        Task<Patient> Create(Patient patient);
        Task<Patient> Update(Patient patient);
        Task<bool> Delete(int id);
        void UpdatePatientStatus(int id, int? statusId, bool? isSentForms, bool? isTakeCare);
        IEnumerable<dynamic> GetPatientCount();
        int GetTotalPatientInCurrentYear();
        int GetTotalPatientInCurrentMonth();
    }
}
