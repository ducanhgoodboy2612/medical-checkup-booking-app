using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public interface IStatusRepo
    {
        List<Status> GetAll();
    }
}
