
import { apiClient } from "../constant/api";

export const updatePatientStatus = async (data: any): Promise<any> => {
    const res = await apiClient.put(`/api/Patient/upd-status`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
};

export const getClinicByDoctor = async (data: any): Promise<any> => {
    const { doctorId } = data;
    const res = await apiClient?.get(`/api/Clinic/get-by-doctorId/${doctorId}`);
    return res?.data;
};

export const createSchedule = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`api/Schedule/create-schedules`, data);
    return res?.data;
};

export const deleteSchedules = async (data: any): Promise<any> => {
    const { doctorId, date } = data;
    try {
        const res = await apiClient?.delete('/api/Schedule/DeleteSchedules', {
            params: { doctorId, date },
        });

        return res;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const uploadMedicalRecordImages = async (id: number, files: File[]): Promise<any> => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const res = await apiClient?.post(`/api/MedicalRecord/${id}/upload-images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res?.data;
    } catch (error: any) {
        console.error('Error uploading medical record images:', error);
        throw error;
    }
};

export const getPatientInfo = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.get(`/api/Patient/${id}`);
    return res?.data;
};

export const createMedicalRecord = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`api/MedicalRecord/create-record`, data);
    return res?.data;
};

export const getAllStatuses = async (): Promise<any> => {
    const res = await apiClient?.get(`/api/Status`);
    return res?.data;
};

export const getMedicalRecord = async (data: any): Promise<any> => {
    const { patientId, doctorId } = data;
    try {
        const res = await apiClient?.get('/api/MedicalRecord/getRecord', {
            params: { patientId, doctorId },
        });

        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};
