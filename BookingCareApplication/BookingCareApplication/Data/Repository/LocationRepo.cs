using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Data.Repository
{
    public class LocationRepo : ILocationRepo
    {
        private readonly BookingcareContext _context;

        public LocationRepo(BookingcareContext context)
        {
            _context = context;
        }
        public List<Province> GetByName(string name)
        {
            if(name == null) 
                return _context.Provinces.ToList();
            return _context.Provinces.Where(s => s.Name.Contains(name)).ToList();
        }

    }
}
