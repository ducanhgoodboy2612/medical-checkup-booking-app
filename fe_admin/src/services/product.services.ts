import { apiClient } from "../constant/api";

export const ProductSearch = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/search`, data);
    return res?.data;
};

export const Product_GetTopSales = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/get-top-sales`, data);
    return res?.data;
};

export const Product_GetInventory = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/get-inventory`, data);
    return res?.data;
};

export const ProductCreate = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/create-product`, data);
    return res?.data;
};

export const ProductUpdate = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Product/update-product`, data);
    return res?.data;
};

export const ProductGetById = async (
    id: any,
): Promise<any> => {
    const res = await apiClient?.get(`/api/Product/get-by-id/` + id);
    //alert(res.data);
    return res?.data;
};



export const Product_Delete = async (
    id: any,
): Promise<any> => {
    //alert("id del: " + id);
    const res = await fetch(`http://localhost:41624/api/Product/delete-product?id=${id}`, {
        method: 'DELETE'
    });
    return 1;
};

export const ImgUpload = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient?.post(`/api/User/upload`, formData);
    return res?.data;
};

export const getMenus = async (): Promise<any> => {
    const res = await apiClient?.get(`/api/Cate/get-all-cate`);
    return res?.data;
};

export const getBrands = async (): Promise<any> => {
    const res = await apiClient?.get(`/api/Brand/get-all-brand`);
    return res?.data;
};
