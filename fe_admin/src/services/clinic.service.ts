
import { apiClient } from "../constant/api";

export const getPaged_Clinic = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`/api/Clinic/get-paged`, data);
    return res?.data;
};

export const getClinicById = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.get(`/api/Clinic/${id}`);
    return res?.data;
};

export const createClinic = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Clinic/create-clinic`, data);
    return res?.data;
};

export const updateClinic = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.put(`/api/Clinic/update-clinic`, data);
    return res?.data;
};

export const deleteClinic = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.delete(`/api/Clinic/delete-clinic/${id}`);
    return res?.data;
};