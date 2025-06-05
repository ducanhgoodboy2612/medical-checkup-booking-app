using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class Post
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? ContentMarkdown { get; set; }

    public string? ContentHtml { get; set; }

    public int? ForDoctorId { get; set; }

    public int? ForSpecializationId { get; set; }

    public int? ForClinicId { get; set; }

    public int WriterId { get; set; }

    public bool? ConfirmByDoctor { get; set; }

    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
