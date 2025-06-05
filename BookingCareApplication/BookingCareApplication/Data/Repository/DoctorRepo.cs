using Azure.Core;
using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;
using System.Linq;

namespace BookingCareApplication.Data.Repository
{
    public class DoctorRepo : IDoctorRepo
    {

        private readonly BookingcareContext _context;

        public DoctorRepo(BookingcareContext context)
        {
            _context = context;
        }

        //public IEnumerable<dynamic> GetPaged(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize)
        //{

        //    var query = from du in _context.DoctorUsers
        //                join u in _context.Users on du.DoctorId equals u.Id
        //                where (specializationId == null || du.SpecializationId == specializationId)
        //                   && (titleId == null || du.TitleId == titleId)
        //                   && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
        //                select new
        //                {
        //                    du.Id,
        //                    du.DoctorId,
        //                    du.ClinicId,
        //                    du.SpecializationId,
        //                    du.InfoHtml,
        //                    du.KeyInfo,
        //                    du.Price,
        //                    du.TitleId,
        //                    Name = u.Name,
        //                    Email = u.Email,
        //                    Phone = u.Phone,
        //                    Avatar = u.Avatar,
        //                    Gender = u.Gender,
        //                    Address = u.Address,
        //                };

        //    query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

        //    return query.ToList();
        //}

        public IEnumerable<dynamic> GetPaged(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize, out int total)
        {
            var query = from du in _context.DoctorUsers
                        join u in _context.Users on du.DoctorId equals u.Id
                        where (specializationId == null || du.SpecializationId == specializationId)
                           && (titleId == null || du.TitleId == titleId)
                           && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
                        select new
                        {
                            du.Id,
                            du.DoctorId,
                            du.ClinicId,
                            du.SpecializationId,
                            du.InfoHtml,
                            du.KeyInfo,
                            du.Price,
                            du.TitleId,
                            Name = u.Name,
                            Email = u.Email,
                            Phone = u.Phone,
                            Avatar = u.Avatar,
                            Gender = u.Gender,
                            Address = u.Address,
                        };

            total = query.Count();

            var pagedQuery = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return pagedQuery.ToList();
        }

        public IEnumerable<dynamic> GetPaged2(int? specializationId, int? titleId, string? name, string? address, int? PriceSorted, int pageIndex, int pageSize, out int total)
        {
            var query = from du in _context.DoctorUsers
                        join u in _context.Users on du.DoctorId equals u.Id
                        where (specializationId == null || du.SpecializationId == specializationId)
                           && (titleId == null || du.TitleId == titleId)
                           && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
                           && (string.IsNullOrEmpty(address) || u.Address.Contains(address))  
                        select new
                        {
                            du.Id,
                            du.DoctorId,
                            du.ClinicId,
                            du.SpecializationId,
                            du.InfoHtml,
                            du.KeyInfo,
                            du.Price,
                            du.TitleId,
                            Name = u.Name,
                            Email = u.Email,
                            Phone = u.Phone,
                            Avatar = u.Avatar,
                            Gender = u.Gender,
                            Address = u.Address,
                            DateOfBirth = u.DateOfBirth,
                        };

            total = query.Count();

            if (PriceSorted.HasValue)
            {
                if (PriceSorted == 1) 
                {
                    query = query.OrderBy(x => x.Price);
                }
                else 
                {
                    query = query.OrderByDescending(x => x.Price);
                }
            }

            var pagedQuery = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return pagedQuery.ToList();
        }


        public IEnumerable<dynamic> GetDoctorsSortedByPatientBooking(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize)
        {
            // Step 1: Lấy dữ liệu từ cơ sở dữ liệu
            var doctorPatientCounts = from p in _context.Patients
                                      group p by p.DoctorId into g
                                      select new
                                      {
                                          DoctorId = g.Key,
                                          PatientCount = (int?)g.Count()

                                      };

            var query = from du in _context.DoctorUsers
                        join u in _context.Users on du.DoctorId equals u.Id
                        join dp in doctorPatientCounts on du.DoctorId equals dp.DoctorId into joined
                        from dp in joined.DefaultIfEmpty()
                        where (specializationId == null || du.SpecializationId == specializationId)
                           && (titleId == null || du.TitleId == titleId)
                           && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
                        select new
                        {
                            du.Id,
                            du.DoctorId,
                            du.ClinicId,
                            du.SpecializationId,
                            du.InfoHtml,
                            du.KeyInfo,
                            du.Price,
                            du.TitleId,
                            Name = u.Name,
                            Email = u.Email,
                            Phone = u.Phone,
                            Avatar = u.Avatar,
                            Gender = u.Gender,
                            Address = u.Address,
                            PatientCount = dp.PatientCount ?? 0
                        };

            // Step 2: Chuyển đổi truy vấn thành danh sách trong bộ nhớ và thực hiện sắp xếp
            var resultList = query.ToList()
                          .OrderByDescending(x => x.PatientCount) // Sắp xếp trực tiếp theo PatientCount
                          .Skip((pageIndex - 1) * pageSize)
                          .Take(pageSize)
                          .ToList();

            return resultList;
        }






        public dynamic GetById(int id)
        {
            var result = (from du in _context.DoctorUsers
                          join u in _context.Users on du.DoctorId equals u.Id
                          where du.DoctorId == id
                          select new
                          {
                              du.Id,
                              du.DoctorId,
                              du.ClinicId,
                              du.SpecializationId,
                              du.InfoHtml,
                              du.KeyInfo,
                              du.Price,
                              du.TitleId,
                              name = u.Name,
                              email = u.Email,
                              dateOfBirth = u.DateOfBirth,
                              address = u.Address,
                              phone = u.Phone,
                              avatar = u.Avatar,
                              gender = u.Gender,
                              isActive = u.IsActive,
                              roleId = u.RoleId
                          }).FirstOrDefault();

            return result;
        }

        public dynamic GetTotalPatientsGroupedByDoctor()
        {
            var result = from p in _context.Patients
                         group p by p.DoctorId into g
                         select new
                         {
                             DoctorId = g.Key,
                             TotalPatients = g.Count()
                         };

            return result.OrderByDescending(x => x.TotalPatients).ToList();
        }

        public class DoctorPatientCount
        {
            public int DoctorId { get; set; }
            public int TotalPatients { get; set; }
        }

        public IEnumerable<dynamic> GetPagedDoctorsByPatientCount2(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize)
        {
            // Lấy danh sách doctor đã sắp xếp theo số lượng bệnh nhân
            var doctors = ((IEnumerable<dynamic>)GetTotalPatientsGroupedByDoctor()).Select(d => new DoctorPatientCount
            {
                DoctorId = (int)d.DoctorId,
                TotalPatients = (int)d.TotalPatients
            });

            // Lấy danh sách doctor phù hợp với các điều kiện lọc
            var query = from du in _context.DoctorUsers
                        join u in _context.Users on du.DoctorId equals u.Id
                        join d in doctors on du.DoctorId equals d.DoctorId
                        where (specializationId == null || du.SpecializationId == specializationId)
                           && (titleId == null || du.TitleId == titleId)
                           && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
                        select new
                        {
                            du.Id,
                            du.DoctorId,
                            du.ClinicId,
                            du.SpecializationId,
                            du.InfoHtml,
                            du.KeyInfo,
                            du.Price,
                            du.TitleId,
                            Name = u.Name,
                            Email = u.Email,
                            Phone = u.Phone,
                            Avatar = u.Avatar,
                            Gender = u.Gender,
                            Address = u.Address,
                            TotalPatients = d.TotalPatients
                        };

            // Sắp xếp danh sách doctor theo số lượng bệnh nhân
            query = query.OrderByDescending(x => x.TotalPatients);

            // Thực hiện phân trang
            query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return query.ToList();
        }


        public IEnumerable<dynamic> GetPagedDoctorsByPatientCount(int? specializationId, int? titleId, string? name, int pageIndex, int pageSize)
        {
            // Fetch doctors that match the criteria first
            var query = from du in _context.DoctorUsers
                        join u in _context.Users on du.DoctorId equals u.Id
                        where (specializationId == null || du.SpecializationId == specializationId)
                           && (titleId == null || du.TitleId == titleId)
                           && (string.IsNullOrEmpty(name) || u.Name.Contains(name))
                        select new
                        {
                            du.Id,
                            du.DoctorId,
                            du.ClinicId,
                            du.SpecializationId,
                            du.InfoHtml,
                            du.KeyInfo,
                            du.Price,
                            du.TitleId,
                            Name = u.Name,
                            Email = u.Email,
                            Phone = u.Phone,
                            Avatar = u.Avatar,
                            Gender = u.Gender,
                            Address = u.Address
                        };

            // Perform the join with the in-memory 'doctors' collection
            var doctors = ((IEnumerable<dynamic>)GetTotalPatientsGroupedByDoctor()).Select(d => new DoctorPatientCount
            {
                DoctorId = (int)d.DoctorId,
                TotalPatients = (int)d.TotalPatients
            });

            var result = query.AsEnumerable() // Switch to LINQ to Objects
                              .Join(doctors, q => q.DoctorId, d => d.DoctorId, (q, d) => new
                              {
                                  q.Id,
                                  q.DoctorId,
                                  q.ClinicId,
                                  q.SpecializationId,
                                  q.InfoHtml,
                                  q.KeyInfo,
                                  q.Price,
                                  q.TitleId,
                                  q.Name,
                                  q.Email,
                                  q.Phone,
                                  q.Avatar,
                                  q.Gender,
                                  q.Address,
                                  TotalPatients = d.TotalPatients
                              });

            // Sort and paginate the result
            result = result.OrderByDescending(x => x.TotalPatients)
                           .Skip((pageIndex - 1) * pageSize)
                           .Take(pageSize);

            return result.ToList();
        }

        public void CreateDoctor(DoctorDetailModel model)
        {
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                Address = model.Address,
                Phone = model.Phone,
                Avatar = model.Avatar,
                Gender = model.Gender,
                Description = model.Description,
                RoleId = 2,
                IsActive = true,
                DateOfBirth = model.DateOfBirth.HasValue ? model.DateOfBirth.Value.Date : null,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var doctorUser = new DoctorUser
            {
                DoctorId = user.Id, // Assuming DoctorId maps to UserId
                SpecializationId = model.SpecializationId,
                InfoHtml = model.InfoHtml,
                KeyInfo = model.KeyInfo,
                Price = model.Price,
                TitleId = model.TitleId,

            };

            _context.DoctorUsers.Add(doctorUser);
            _context.SaveChanges();
        }



        public async Task<string> UploadImage(IFormFile avatarFile)
        {


            // Tạo đường dẫn để lưu file trong thư mục "wwwroot/uploads"
            var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            // Kết hợp với thư mục uploads
            var uploadsFolder = Path.Combine(wwwrootPath, "uploads");
            //if (!Directory.Exists(uploadsFolder))
            //{
            //    Directory.CreateDirectory(uploadsFolder);
            //}

            // Tạo tên file duy nhất
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + avatarFile.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Lưu file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatarFile.CopyToAsync(stream);
            }

            

            //return Ok(new { message = "User created successfully", filePath });

            string avatarUrl = $"/uploads/{uniqueFileName}";
            return avatarUrl;
        }



        //public async Task CreateDoctor2(DoctorDetailModel model, IFormFile avatarFile)
        //{
        //    if (model == null)
        //    {
        //        throw new ArgumentNullException(nameof(model), "Invalid request");
        //    }

        //    string avatarUrl = null;

        //    // Check if the avatar file exists
        //    if (avatarFile != null)
        //    {
        //        var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        //        var uploadsFolder = Path.Combine(wwwrootPath, "uploads");
                
        //        // Tạo tên file duy nhất
        //        var uniqueFileName = Guid.NewGuid().ToString() + "_" + avatarFile.FileName;
        //        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //        // Lưu file
        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await avatarFile.CopyToAsync(stream);
        //        }

        //        avatarUrl = $"/uploads/{uniqueFileName}";
        //    }

        //    var user = new User
        //    {
        //        Name = model.Name,
        //        Email = model.Email,
        //        Address = model.Address,
        //        Phone = model.Phone,
        //        Avatar = avatarUrl,  // Store the URL of the uploaded avatar
        //        Gender = model.Gender,
        //        Description = model.Description,
        //        RoleId = 2,
        //        IsActive = true,
        //        DateOfBirth = model.DateOfBirth?.Date,
        //        CreatedAt = DateTime.Now,
        //        UpdatedAt = DateTime.Now
        //    };

        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();

        //    var doctorUser = new DoctorUser
        //    {
        //        DoctorId = user.Id,
        //        SpecializationId = model.SpecializationId,
        //        InfoHtml = model.InfoHtml,
        //        KeyInfo = model.KeyInfo,
        //        Price = model.Price,
        //        TitleId = model.TitleId,
        //    };

        //    _context.DoctorUsers.Add(doctorUser);
        //    await _context.SaveChangesAsync();
        //}


        public void UpdateDoctor(DoctorDetailModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == model.DoctorId);
            var doctorUser = _context.DoctorUsers.FirstOrDefault(d => d.DoctorId == model.DoctorId);

            if (user != null && doctorUser != null)
            {
                // Update User details
                user.Name = model.Name;
                user.Email = model.Email;
                //user.Password = model.Password;  
                user.Address = model.Address;
                user.Phone = model.Phone;
                if (!string.IsNullOrEmpty(model.Avatar))
                {
                    user.Avatar = model.Avatar;
                }

                user.Gender = model.Gender;
                user.Description = model.Description;
                if (model.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = model.DateOfBirth.Value.Date;
                }
                //user.RoleId = model.RoleId;
                //user.IsActive = model.IsActive;
                user.UpdatedAt = DateTime.Now;

                // Update DoctorUser details
                //doctorUser.ClinicId = model.ClinicId;
                doctorUser.SpecializationId = model.SpecializationId;
                doctorUser.InfoHtml = model.InfoHtml;
                doctorUser.KeyInfo = model.KeyInfo;
                doctorUser.Price = model.Price;
                doctorUser.TitleId = model.TitleId;

                _context.SaveChanges();
            }
        }

        public void DeleteDoctor(int doctorId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == doctorId);
            var doctorUser = _context.DoctorUsers.FirstOrDefault(d => d.DoctorId == doctorId);

            if (user != null && doctorUser != null)
            {
                user.DeletedAt = DateTime.Now;
                _context.DoctorUsers.Remove(doctorUser);
                _context.SaveChanges();
            }
        }


    }

    public class DoctorDetailModel
    {
        // Properties from User class
        //public int Id { get; set; }
        public int DoctorId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public string? Gender { get; set; }
        public string? Description { get; set; }
        //public IFormFile AvatarFile { get; set; }


        // Properties from DoctorUser class
        //public int DoctorId { get; set; }
        //public int ClinicId { get; set; }
        public int SpecializationId { get; set; }
        public string? InfoHtml { get; set; }
        public string? KeyInfo { get; set; }
        public int? Price { get; set; }
        public int? TitleId { get; set; }
    }

}
