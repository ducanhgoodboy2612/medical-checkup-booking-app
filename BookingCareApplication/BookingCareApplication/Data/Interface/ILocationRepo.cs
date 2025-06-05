using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public interface ILocationRepo
    {
        List<Province> GetByName(string name);
    }
}
