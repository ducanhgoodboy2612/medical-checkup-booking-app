using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Data.Repository
{
    public class StatusRepo : IStatusRepo
    {
        private readonly BookingcareContext _context;

        public StatusRepo(BookingcareContext context)
        {
            _context = context;
        }

        public List<Status> GetAll()
        {
            return _context.Statuses.ToList();
        }

    }
}
