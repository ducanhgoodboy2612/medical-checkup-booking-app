import { apiClient } from "../constant/api";

export const apiLogin = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.post(`/api/User/login`, data);  
    return res?.data;
  };

 