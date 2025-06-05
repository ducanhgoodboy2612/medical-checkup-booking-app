import { apiClient } from "../constant/api";

export const getPaged_Spec = async (data: any): Promise<any> => {
    const { page, pageSize, keyword } = data;
    const res = await apiClient?.get(`/api/Specialty/get-paged`, {
        params: { keyword, pageIndex: page, pageSize },
    });
    return res?.data;
};

export const getAllTitles = async (): Promise<any> => {
    const res = await apiClient?.get(`/api/Title/get-all`);
    return res?.data;
};

export const getPaged_Patients = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Patient/get-paged`, data);
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