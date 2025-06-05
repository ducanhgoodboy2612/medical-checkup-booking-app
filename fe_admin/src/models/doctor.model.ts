interface DoctorDetailType {
    id: any;
    name?: string;
    email?: string;
    dateOfBirth?: string;
    password?: string;
    address?: string;
    phone?: string;
    avatar?: string;
    gender?: string;
    description?: string;
    roleId: number;
    isActive?: boolean;

    doctorId: any;
    clinicId: number;
    specializationId: number;
    infoHtml?: string;
    keyInfo?: string;
    price?: number;
    titleId?: number;
}
export default DoctorDetailType;