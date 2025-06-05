import { apiClient } from "../constant/api";

export const UserSearch = async (data: any): Promise<any> => {
  const res = await apiClient?.post(`/api/User/get-paged-user`, data);
  return res?.data;
};

  export const apiCreateUser = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.post(`/api/User/create-user`, data);  
    return res?.data;
  };

  export const apiUpdateUser = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.put(`/api/User/update-user`, data);  
    return res?.data;
  };

  

  export const apiGetUserById = async (data: any): Promise<any> => {
    const { userId } = data;
    const res = await apiClient?.get(`/api/User/get-by-id?userId=${userId}`);
    return res?.data;
  };

  export const apiDelete = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.post(`/api/Users/delete-user`, data);  
    return res?.data;
  };


  export const login = async (data: any): Promise<any> => {
    const res = await apiClient?.post(`/api/User/login`, data);
    return res?.data;
};

export const UserAccSearch = async (data: any): Promise<any> => {
  const res = await apiClient?.post(`/api/User/search-user-acc`, data);
  return res?.data;
};

