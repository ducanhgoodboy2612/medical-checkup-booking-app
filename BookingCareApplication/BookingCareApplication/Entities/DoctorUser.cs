using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class DoctorUser
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public int ClinicId { get; set; }

    public int SpecializationId { get; set; }

    public string? InfoHtml { get; set; }

    public string? KeyInfo { get; set; }

    public int? Price { get; set; }

    public int? TitleId { get; set; }
}
