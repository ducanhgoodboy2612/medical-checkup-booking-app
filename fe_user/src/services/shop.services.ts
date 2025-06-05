import { apiClient } from "../constant/api";

export const getProduct = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/search`, data); 
    // alert(JSON.stringify(res));
    return res?.data;
  };

  export const getProductByCate = async (
    data: any,
  ): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/search_full_prod`, data);  
    return res?.data;
  };

export const getPromotion = async (
  id: any,
): Promise<any> => {
  const res = await apiClient?.get(`/api/Product/get-promotion/` + id);
  return res?.data;
};

export const getProductByID = async (
  id: any,
): Promise<any> => {
  const res = await apiClient?.get(`/api/Product/get-by-id/` + id);
  return res?.data;
};

export const Product_GetTopSales = async (
  data: any,
): Promise<any> => {
  const res = await apiClient?.post(`/api/Product/get-top-sales`, data);
  return res?.data;
};

export const Product_GetNew = async (

): Promise<any> => {
  const res = await apiClient?.get(`/api/Product/get-new-prod`);
  return res?.data;
};