

using BookingCareApplication.Entities;
using static BookingCareApplication.Data.ClinicRepo;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IClinicRepo
    {
        IEnumerable<Clinic> GetAll();
        IEnumerable<Clinic> GetPaged(string? keyword, string? address, int pageIndex, int pageSize, out int total);
        
        Clinic GetById(int id);
        List<Clinic> GetByDoctorId(int doctorId);
        void CreateClinic(ClinicDetailModel model);
        void UpdateClinic(ClinicDetailModel model);
        void DeleteClinic(int id);
    }
}
