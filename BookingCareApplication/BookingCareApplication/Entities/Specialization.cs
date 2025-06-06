﻿using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Specialization
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
