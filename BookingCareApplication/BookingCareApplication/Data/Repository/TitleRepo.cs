using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Repository
{
    public class TitleRepo : ITitleRepo
    {
        private readonly BookingcareContext _context;

        public TitleRepo(BookingcareContext context)
        {
            _context = context;
        }

        public List<Title> GetAll()
        {
            return _context.Titles.ToList();
        }
    }
}
