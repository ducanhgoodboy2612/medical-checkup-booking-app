using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IScheduleRepo
    {
        IEnumerable<dynamic> GetSchedules(int? doctorId, string? date);
        Schedule GetById(int id);
        void CreateSchedule(Schedule model);
        void CreateSchedules(List<Schedule> models);
        bool DeleteSchedules(int doctorId, string date);
    }
}
