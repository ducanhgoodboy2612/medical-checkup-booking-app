using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using System.ComponentModel.DataAnnotations;

namespace BookingCareApplication.Data.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly BookingcareContext _context;

        public UserRepo(BookingcareContext context)
        {
            _context = context;
        }


        public User Login(string email, string password)
        {
            var user = _context.Users
                               .SingleOrDefault(u => u.Email == email && u.Password == password);

            return user;
        }

        public IEnumerable<dynamic> GetPagedUsers(string? name, string? email, int pageIndex, int pageSize, out int total)
        {
            var query = from u in _context.Users
                        where (string.IsNullOrEmpty(name) || u.Name.Contains(name))     
                           && (string.IsNullOrEmpty(email) || u.Email.Contains(email)) 
                        select u;  

            total = query.Count();

            var pagedQuery = query
                             .Skip((pageIndex - 1) * pageSize) 
                             .Take(pageSize);                  

            // Trả về kết quả của trang hiện tại
            return pagedQuery.ToList();
        }

        public void CreateUser(UserDetailsDto model)
        {
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                Password = model.Password,  // ma hoa pass
                Address = model.Address,
                Phone = model.Phone,
                Avatar = model.Avatar,
                Gender = model.Gender,
                DateOfBirth = model.DateOfBirth,

                Description = model.Description,
                RoleId = model.RoleId,
                IsActive = model.IsActive ? model.IsActive : true, 
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void UpdateUser(UserDetailsDto model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == model.Id);

            if (user != null)
            {
                user.Name = model.Name;
                user.Email = model.Email;
                user.Password = model.Password;  
                user.Address = model.Address;
                user.Phone = model.Phone;
                if (!string.IsNullOrEmpty(model.Avatar))
                {
                    user.Avatar = model.Avatar;
                }
                user.Gender = model.Gender;
                user.DateOfBirth = model.DateOfBirth;
                user.Description = model.Description;
                user.RoleId = model.RoleId;
                user.IsActive = model.IsActive;
                user.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
            }
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            if (user != null)
            {
                user.DeletedAt = DateTime.Now; // Thực hiện xóa mềm (soft delete)
                _context.SaveChanges();
            }
        }

        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(s => s.Id == id);
        }
    }

    public class UserDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Address { get; set; }
        public string Phone { get; set; }
        public string? Avatar { get; set; }
        public string Gender { get; set; }
        public string? Description { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public int RoleId { get; set; }
        public bool IsActive { get; set; }
    }


    public class AuthenticateModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class AppSettings
    {
        public string Secret { get; set; }

    }
}
