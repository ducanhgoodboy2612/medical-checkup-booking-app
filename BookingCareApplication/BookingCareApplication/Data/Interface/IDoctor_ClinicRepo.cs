using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IDoctor_ClinicRepo
    {
        IEnumerable<dynamic> GetClinicsByDoctorId(int doctorId);
        void Create(DoctorClinic doctorClinic);
        void Delete(int id);
    }
}
