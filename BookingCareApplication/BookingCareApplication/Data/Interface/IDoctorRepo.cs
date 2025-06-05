using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IDoctorRepo
    {
        IEnumerable<dynamic> GetPaged(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize, out int total);
        IEnumerable<dynamic> GetDoctorsSortedByPatientBooking(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize);
        dynamic GetTotalPatientsGroupedByDoctor();
        IEnumerable<dynamic> GetPaged2(int? specializationId, int? titleId, string? name, string? address, int? PriceSorted, int pageIndex, int pageSize, out int total);
        dynamic GetById(int id);
        IEnumerable<dynamic> GetPagedDoctorsByPatientCount(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize);

        void CreateDoctor(DoctorDetailModel model);
        void UpdateDoctor(DoctorDetailModel model);
        void DeleteDoctor(int id);

        // Task CreateDoctor2(DoctorDetailModel model, IFormFile avatarFile);
        Task<string> UploadImage(IFormFile avatarFile);

    }
}
