import { apiClient } from "../constant/api";

export const InvoiceSearch = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Invoice/search-full`, data);
    return res?.data;
};

export const InvoiceSearch2 = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Invoice/search-invoice`, data);
    return res?.data;
};

export const InvoiceGetById = async (
    id: any,
): Promise<any> => {
    const res = await apiClient?.get(`/api/Invoice/get-by-id/` + id);
    //alert(JSON.stringify(res.data.list_json_invoice_detail));
    return res?.data;
};

export const getInvoiceDetail = async (
    id: any,
): Promise<any> => {
    const res = await apiClient?.get(`/api/Invoice/get-by-id/` + id);
    //alert(JSON.stringify(res.data.list_json_invoice_detail));
    return res?.data.list_json_invoice_detail;
};

export const Invoice_Delete = async (
    id: any,
): Promise<any> => {
    //alert("id del: " + id);
    const res = await fetch(`http://localhost:41624/api/Invoice/delete-invoice?id=${id}`, {
        method: 'DELETE'
    });
    return 1;
};



export const InvoiceUpdate_Info = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Invoice/update-invoice-info`, data);
    return res?.data;
};

export const InvoiceUpdate_DetailProd = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Invoice/update-invoice-detail-prod`, data);
    return res?.data;
};

// export interface InvoiceDetail_U {
//     invoiceID: number;
//     product_Id: number;
//     quantity: number;
// }

// export const InvoiceUpdate_DetailProd = async (
//     model: InvoiceDetail_U
// ): Promise<any> => {
//     try {
//         const res = await apiClient.post('/api/Invoice/update-invoice-detail-prod', model);
//         return res.data;
//     } catch (error) {
//         // Handle errors here
//         console.error('Error updating invoice detail:', error);
//         throw error;
//     }
// };