using System;
using System.Collections.Generic;

namespace BookingCareApplication.Entities;

public partial class MedicalRecord
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public double? Height { get; set; }

    public double? Weight { get; set; }

    public int? HeartRate { get; set; }

    public double? Temperature { get; set; }

    public string? GeneralConclusion { get; set; }

    public int? DiseaseProgressStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateOnly? ReExaminationDate { get; set; }
}
