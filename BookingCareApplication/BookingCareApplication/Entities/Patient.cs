using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Patient
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public int StatusId { get; set; }

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? DateBooking { get; set; }

    public string? TimeBooking { get; set; }

    public string? Email { get; set; }

    public string? Gender { get; set; }

    public string? Year { get; set; }

    public string? Address { get; set; }

    public string? Description { get; set; }

    public bool IsSentForms { get; set; }

    public bool IsTakeCare { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
