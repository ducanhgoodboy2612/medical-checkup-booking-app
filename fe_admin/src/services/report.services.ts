import { apiClient } from "../constant/api";

export const apiGetTotalRevenue = async (
   
): Promise<any> => {
    const res = await apiClient?.get(`api/Report_Statistic/get-total-revenue`);
    return res?.data;
};

// export const GetRevenueByDateRange = async (startDate: Date, endDate: Date): Promise<any> => {
//     try {
//         const response = await apiClient?.post<number>('api/Report_Statistic/get-total-revenue-by-date?startDate=${startDate}&endDate=${endDate}');
//         return response?.data ?? null;
//     } catch (error) {
//         console.error('Error fetching total revenue by date range:', error);
//         return null;
//     }
// };

export const apiGetTotalRevenueByDateRange = async (startDate: string, endDate: string): Promise<any> => {
    try {
        const response = await apiClient?.get(
            `https://localhost:44315/api/Report_Statistic/get-total-revenue-by-date?startDate=${startDate}&endDate=${endDate}`
        );
        return response?.data ?? null;
    } catch (error) {
        console.error('Error fetching total revenue by date range:', error);
        return null;
    }
};