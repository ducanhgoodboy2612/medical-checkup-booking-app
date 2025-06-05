interface PatientDetailType {
    id: any;
    doctorId: number;
    statusId: number;
    name?: string;
    phone?: string;
    dateBooking?: string;
    timeBooking?: string;
    email?: string;
    gender?: string;
    year?: string;
    address?: string;
    description?: string;
    isSentForms?: boolean;
    isTakeCare?: boolean;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export default PatientDetailType;
