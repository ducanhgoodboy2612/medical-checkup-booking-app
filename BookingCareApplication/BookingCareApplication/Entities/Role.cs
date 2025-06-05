using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Role
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
