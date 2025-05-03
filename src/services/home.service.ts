import { apiClient } from "../constant/api";

export const getPaged_Doctor = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`/api/Doctor/get-paged-v2`, data);
    return res?.data;
};
export const getPaged_Spec = async (data: any): Promise<any> => {
    const { page, pageSize, keyword } = data;
    const res = await apiClient?.get(`https://localhost:44393/api/Specialty/get-paged`, {
        params: { keyword, pageIndex: page, pageSize  },
    });
    return res?.data;
};

export const getPaged_Clinic = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`/api/Clinic/get-paged`, data);
    return res?.data;
};

export const getTop_Doctor = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`https://localhost:44393/api/Doctor/get-top`, data);
    return res?.data;
};

export const getLocation = async (data: any): Promise<any> => {
    const { keyword } = data;
    const res = await apiClient?.get(`/api/Location/GetLocation`, {
        params: { keyword },
    });
    return res?.data;
};
export const getAllTitle = async (): Promise<any> => {
    
    const res = await apiClient?.get(`/api/Title/get-all`);
    return res?.data;
};

export const getNotification = async (data: any): Promise<any> => {
    const { patient_email } = data;
    const res = await apiClient?.get(`/api/Notification/get-reexamination-notification`, {
        params: { patient_email },
    });
    return res?.data;
};

export const getSpecialty = async (data: any): Promise<any> => {
    const { id } = data;
    try {
        const res = await apiClient?.get(`/api/Specialty/${id}`);
        return res?.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const deleteAppointment = async (id: any): Promise<void> => {
    const res = await apiClient?.delete(`/api/Patient/${id}`);
    return res?.data;
};

