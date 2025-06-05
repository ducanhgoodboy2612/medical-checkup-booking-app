import { apiClient } from "../constant/api";

export const DoctorSearch = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`https://localhost:44393/api/Doctor/get-paged-doctor`, data);
    return res?.data;
};

export const getDoctorById = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.get(`/api/Doctor/${id}`);
    return res?.data;
};

export const getClinicsByDocId = async (data: any): Promise<any> => {
    const { doctorId } = data;
    const res = await apiClient?.get(`/api/Doctor_Clinic/get-by-doctorid/${doctorId }`);
    return res?.data;
};

export const getSpecialty = async (data: any): Promise<any> => {
    const { id } = data;
    try {
        const res = await apiClient?.get(`/api/Specialty/${id}`);
        return res?.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
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

export const createDoctor = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.post(`/api/Doctor/create-doctor`, data);
    return res?.data;
};

// export const createDoctor = async (data: any): Promise<any> => {
//     const formData = new FormData();

//     // Duyệt qua các trường trong object `data` và thêm vào formData
//     for (const key in data) {
//         if (data.hasOwnProperty(key)) {
//             formData.append(key, data[key]);
//         }
//     }

//     const res = await apiClient?.post(`/api/Doctor/create-doctor`, formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });

//     return res?.data;
// };


export const updateDoctor = async (
    data: any,
): Promise<any> => {
    const res = await apiClient?.put(`/api/Doctor/update-doctor`, data);
    return res?.data;
};

export const getDoctor = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.get(`/api/Doctor/${id}`);
    return res?.data;
};

  export const deleteDoctor = async (
    id: any,
  ): Promise<any> => {
    const res = await apiClient?.delete(`/api/Doctor/delete-doctor/${id}`);  
    return res?.data;
  };

// export const ProductGetById = async (
//     id: any,
// ): Promise<any> => {
//     const res = await apiClient?.get(`/api/Product/get-by-id/` + id);
//     //alert(res.data);
//     return res?.data;
// };



// export const Product_Delete = async (
//     id: any,
// ): Promise<any> => {
//     //alert("id del: " + id);
//     const res = await fetch(`http://localhost:41624/api/Product/delete-product?id=${id}`, {
//         method: 'DELETE'
//     });
//     return 1;
// };

// export const ImgUpload = async (file: File): Promise<any> => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await apiClient?.post(`/api/User/upload`, formData);
//     return res?.data;
// };

// export const getMenus = async (): Promise<any> => {
//     const res = await apiClient?.get(`/api/Cate/get-all-cate`);
//     return res?.data;
// };

// export const getBrands = async (): Promise<any> => {
//     const res = await apiClient?.get(`/api/Brand/get-all-brand`);
//     return res?.data;
// };
