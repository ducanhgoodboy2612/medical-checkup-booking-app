using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookingCareApplication.Data.Repository
{
    public class ScheduleRepo : IScheduleRepo
    {
        private readonly BookingcareContext _context;

        public ScheduleRepo(BookingcareContext context)
        {
            _context = context;
        }


        public IEnumerable<dynamic> GetSchedules(int? doctorId, string? date)
        {
            var query = from s in _context.Schedules
                        join c in _context.Clinics on s.ClinicId equals c.Id
                        where (doctorId == null || s.DoctorId == doctorId)
                           && (string.IsNullOrEmpty(date) || s.Date == date)
                        select new
                        {
                            s.Id,
                            s.DoctorId,
                            s.Date,
                            s.Time,
                            s.ClinicId,
                            ClinicName = c.Name,
                            ClinicAdd = c.Address
                        };

            return query.ToList();
        }


        public Schedule GetById(int id)
        {
            return _context.Schedules.FirstOrDefault(s => s.Id == id);
        }

        public void CreateSchedule(Schedule model)
        {
            var schedule = new Schedule
            {
                DoctorId = model.DoctorId ,
                Date = model.Date ,
                Time = model.Time ,
                MaxBooking = model.MaxBooking,
                SumBooking = model.SumBooking,
                CreatedAt = DateTime.Now,
                ClinicId = model.ClinicId
            };

            _context.Schedules.Add(schedule);
            _context.SaveChanges();
        }

        public void CreateSchedules(List<Schedule> models)
        {
            foreach (var model in models)
            {
                var schedule = new Schedule
                {
                    DoctorId = model.DoctorId,
                    Date = model.Date,
                    Time = model.Time,
                    MaxBooking = model.MaxBooking,
                    SumBooking = model.SumBooking,
                    CreatedAt = DateTime.Now,
                    ClinicId = model.ClinicId
                };

                _context.Schedules.Add(schedule);
            }

            _context.SaveChanges();
        }

        public bool DeleteSchedules(int doctorId, string date)
        {
            try
            {
                var schedulesToDelete = _context.Schedules
                    .Where(s => s.DoctorId == doctorId && s.Date == date)
                    .ToList();

                if (schedulesToDelete.Any())
                {
                    _context.Schedules.RemoveRange(schedulesToDelete);
                    _context.SaveChanges();
                    return true;
                }
                return false; 
            }
            catch (Exception ex)
            {
                // Log lỗi nếu có
                throw new Exception("Error deleting schedules", ex);
            }
        }
    }
}
