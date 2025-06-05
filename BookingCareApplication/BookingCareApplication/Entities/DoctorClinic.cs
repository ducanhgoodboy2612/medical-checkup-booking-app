using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class DoctorClinic
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public int ClinicId { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
