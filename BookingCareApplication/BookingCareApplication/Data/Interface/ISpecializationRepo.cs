using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface ISpecializationRepo
    {
        IEnumerable<Specialization> GetPaged(string keyword, int pageIndex, int pageSize);

        Specialization GetById(int id);
        void Create(Specialization specialization);
        void Update(Specialization specialization);
        void Delete(int id);
    }
}
