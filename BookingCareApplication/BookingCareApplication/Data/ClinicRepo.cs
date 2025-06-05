using BookingCareApplication.Data.Interface;
using BookingCareApplication.Entities;

namespace BookingCareApplication.Data
{
    public class ClinicRepo : IClinicRepo
    {
        private readonly BookingcareContext _context;

        public ClinicRepo(BookingcareContext context)
        {
            _context = context;
        }

        public IEnumerable<Clinic> GetAll()
        {
            return _context.Clinics.ToList();
        }

        public Clinic GetById(int id)
        {
            return _context.Clinics.Find(id);
        }
        public List<Clinic> GetByDoctorId(int doctorId)
        {
            var clinics = (from doctorUser in _context.DoctorUsers
                           join clinic in _context.Clinics on doctorUser.ClinicId equals clinic.Id
                           where doctorUser.DoctorId == doctorId
                           select clinic).ToList();
            return clinics;
        }

        public IEnumerable<Clinic> GetPaged(string? keyword, string? address, int pageIndex, int pageSize, out int total)
        {
            var query = _context.Clinics
                        .Where(c => c.DeletedAt == null) 
                        .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(c => c.Name.Contains(keyword));
            }

            if (!string.IsNullOrEmpty(address))
            {
                query = query.Where(c => c.Address.Contains(address));
            }

            // Get the total count of records before applying pagination
            total = query.Count();

            // Apply pagination
            return query.Skip((pageIndex - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
        }


        public void CreateClinic(ClinicDetailModel model)
        {
            var clinic = new Clinic
            {
                Name = model.Name,
                Address = model.Address,
                Phone = model.Phone,
                IntroductionHtml = model.IntroductionHtml,
                IntroductionMarkdown = model.IntroductionMarkdown,
                Description = model.Description,
                Image = model.Image,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Clinics.Add(clinic);
            _context.SaveChanges();
        }

        public void UpdateClinic(ClinicDetailModel model)
        {
            var clinic = _context.Clinics.FirstOrDefault(c => c.Id == model.Id);

            if (clinic != null)
            {
                clinic.Name = model.Name;
                clinic.Address = model.Address;
                clinic.Phone = model.Phone;
                clinic.IntroductionHtml = model.IntroductionHtml;
                clinic.IntroductionMarkdown = model.IntroductionMarkdown;
                clinic.Description = model.Description;
                clinic.Image = model.Image;
                clinic.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
            }
        }

        public void DeleteClinic(int clinicId)
        {
            var clinic = _context.Clinics.FirstOrDefault(c => c.Id == clinicId);

            if (clinic != null)
            {
                clinic.DeletedAt = DateTime.Now;
                _context.SaveChanges();
            }
        }



        public class ClinicDetailModel
        {
            public int Id { get; set; }

            public string? Name { get; set; }

            public string? Address { get; set; }

            public string? Phone { get; set; }

            public string? IntroductionHtml { get; set; }

            public string? IntroductionMarkdown { get; set; }

            public string? Description { get; set; }

            public string? Image { get; set; }

        }
    }
}
