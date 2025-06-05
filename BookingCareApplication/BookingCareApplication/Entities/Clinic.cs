using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Clinic
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? IntroductionHtml { get; set; }

    public string? IntroductionMarkdown { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
