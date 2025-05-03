import axios from "axios";
export const apiClient = axios.create({ 
  baseURL: 'https://localhost:44393',
    timeout: 1000 * 60 * 30 * 3, // 90 minutes
  });
