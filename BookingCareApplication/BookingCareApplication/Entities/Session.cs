using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Session
{
    public string Sid { get; set; } = null!;

    public DateTime? Expires { get; set; }

    public string? Data { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
