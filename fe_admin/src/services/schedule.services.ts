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

export const getPatientsBySchedule = async (scheduleId: number): Promise<any> => {
  try {
    const res = await apiClient?.get(`/api/Patient/get-patient-by-schedule/${scheduleId}`);
    return res?.data;
  } catch (error) {
    console.error('Error fetching patients by schedule:', error);
    throw error;
  }
};
