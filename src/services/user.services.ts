import { apiClient } from "../constant/api";

export const getUser = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/User/login`, data);
    alert(JSON.stringify(res.data));
    return res?.data;
};

export const login = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`/api/User/login`, data);
    return res?.data;
};

export const createUser = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/User/create-userAcc`, data);
    return res?.data;
};


export const apiCreateUser = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/User/create-user`, data);
    return res?.data;
};

export const upload = async (formData: FormData): Promise<any> => {
    try {
        const response = await apiClient?.post('/api/Doctor/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const getUserbyId = async (id: any): Promise<any> => {
    try {
        const res = await apiClient?.get(`/api/User/get-by-id?userId=${id}`);
        return res?.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching user:', error);
        throw error;
    }
};