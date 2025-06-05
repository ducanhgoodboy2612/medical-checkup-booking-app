
import { apiClient } from "../constant/api";

export const getDoctor = async (data: any): Promise<any> => {
  const { id } = data;
  const res = await apiClient?.get(`/api/Doctor/${id}`);
  return res?.data;
};

export const getSpecbyId = async (data: any): Promise<any> => {
  const { id } = data;
  const res = await apiClient?.get(`/api/Specialization/${id}`);
  return res?.data;
};