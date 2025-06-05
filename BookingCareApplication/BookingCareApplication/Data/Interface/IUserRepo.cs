using BookingCareApplication.Data.Repository;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data.Interface
{
    public partial interface IUserRepo
    {
        User Login(string email, string password);
        IEnumerable<dynamic> GetPagedUsers(string? name, string? email, int pageIndex, int pageSize, out int total);
        void CreateUser(UserDetailsDto model);
        void UpdateUser(UserDetailsDto model);
        void DeleteUser(int id);
        User GetById(int id);
    }
}
