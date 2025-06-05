import { apiClient } from "../constant/api";


export const getSchedules = async (data: any): Promise<any> => {
    const { doctorId, date } = data;
    try {
        const res = await apiClient?.get('/api/Schedule/GetSchedules', {
            params: { doctorId, date },
        });

        if (res?.data && res.data.length === 0) {
            return null; 
        }

        return res?.data; 
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null; 
        }
        console.error('Error fetching schedules:', error);
        throw error; 
    }
};

export const increaseSumBooking = async (scheduleId: number, quantity: number): Promise<any> => {
    try {
        const res = await apiClient.post(`/api/Schedule/update-sum-booking?scheduleId=${scheduleId}&quantity=${quantity}`);
        return res?.data;
    } catch (error) {
        console.error("Error increasing sum booking:", error);
        throw error;
    }
};

export const getScheduleById = async (scheduleId: any): Promise<any> => {
    // const { scheduleId } = data;
    try {
        const res = await apiClient?.get(`/api/Schedule/get-by-id?scheduleId=${scheduleId}`);
        console.log("url", `/api/Schedule/get-by-id?scheduleId=${scheduleId}`);

        if (res?.data && res.data.length === 0) {
            return null; 
        }
        console.log("res", res);
        return res?.data; 
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const getDoctor = async (data: any): Promise<any> => {
    const { id } = data;
    const res = await apiClient?.get(`/api/Doctor/${id}`);
    return res?.data;
};

export const booking = async (data: any): Promise<any> => {
    const res = await apiClient.post(`/api/Patient/create-patient`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res?.data;
};

export const getAppointment = async (data: any): Promise<any> => {
    const { email, doctorId } = data;
    try {
        const res = await apiClient?.get('/api/Patient/get-appointment', {
            params: { email, doctorId },
        });
        return res?.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const getClinicInfo = async (data: any): Promise<any> => {
    const { id } = data;
    try {
        const res = await apiClient?.get(`/api/Clinic/${id}`);
        return res?.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching schedules:', error);
        throw error;
    }
};


export const cancelAppointment = async (id: number) => {
    try {
        await apiClient?.patch(`/api/Patient/update-status`, null, {
            params: { patientId: id, statusId: 4 }
        });

    } catch (error) {
        console.error("Lỗi khi hủy lịch:", error);
    }
};
