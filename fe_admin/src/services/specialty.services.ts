import { apiClient } from "../constant/api";

export const searchSpecialty = async (data: {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
}): Promise<any> => {
  const { keyword = '', pageIndex = 1, pageSize = 10 } = data;
  const res = await apiClient?.get(`/api/Specialty/get-paged`, {
    params: { keyword, pageIndex, pageSize },
  });
  return res?.data;
};


export const createSpecialty = async (data: {
  name: string;
  description?: string;
  image?: string;
  createdAt: string; // ISO date string
}): Promise<any> => {
  const res = await apiClient?.post(`/api/Specialty`, data);
  return res?.data;
};


export const updateSpecialty = async (data: {
  id: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
}): Promise<void> => {
  const { id, ...rest } = data;
  await apiClient?.put(`/api/Specialty/${id}`, { id, ...rest });
};

export const getSpecialtyById = async (data: { id: number }): Promise<any> => {
  const { id } = data;
  const res = await apiClient?.get(`/api/Specialty/${id}`);
  return res?.data;
};

export const deleteSpecialty = async (data: { id: number }): Promise<void> => {
  const { id } = data;
  await apiClient?.delete(`/api/Specialty/${id}`);
};

