using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Repository
{
    public class SpecializationRepo : ISpecializationRepo
    {
        private readonly BookingcareContext _context;

        public SpecializationRepo(BookingcareContext context)
        {
            _context = context;
        }

        // Tìm kiếm và phân trang
        public IEnumerable<Specialization> GetPaged(string keyword, int pageIndex, int pageSize)
        {
            var query = _context.Specializations.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(s => s.Name.Contains(keyword) || s.Description.Contains(keyword));
            }

            return query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Tìm kiếm theo ID
        public Specialization GetById(int id)
        {
            return _context.Specializations.Find(id);
        }

        // Tạo mới Specialization
        public void Create(Specialization specialization)
        {
            specialization.CreatedAt = DateTime.UtcNow;
            _context.Specializations.Add(specialization);
            _context.SaveChanges();
        }

        // Cập nhật Specialization
        public void Update(Specialization specialization)
        {
            var existingSpecialization = _context.Specializations.Find(specialization.Id);
            if (existingSpecialization != null)
            {
                existingSpecialization.Name = specialization.Name;
                existingSpecialization.Description = specialization.Description;
                existingSpecialization.Image = specialization.Image;
                existingSpecialization.UpdatedAt = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }

        // Xóa Specialization (Soft Delete)
        public void Delete(int id)
        {
            var specialization = _context.Specializations.Find(id);
            if (specialization != null)
            {
                //specialization.DeletedAt = DateTime.UtcNow;
                //_context.SaveChanges();
            }
        }
    }
}
