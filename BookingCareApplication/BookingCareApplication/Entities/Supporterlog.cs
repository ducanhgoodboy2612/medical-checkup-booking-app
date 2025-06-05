using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Supporterlog
{
    public int Id { get; set; }

    public int? PatientId { get; set; }

    public int? SupporterId { get; set; }

    public string? Content { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
