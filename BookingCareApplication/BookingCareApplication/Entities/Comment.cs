using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Comment
{
    public int Id { get; set; }

    public int? DoctorId { get; set; }

    public string? TimeBooking { get; set; }

    public string? DateBooking { get; set; }

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Content { get; set; }

    public bool Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
