import axios from "axios";
export const apiClient = axios.create({ 
  baseURL: 'https://localhost:44393',
    timeout: 1000 * 60 * 30 * 3, // 90 minutes
  });
  apiClient.interceptors.request.use(
    function (config) {
      let user = JSON.parse(localStorage.getItem('user') || '{}');
      config.headers.Authorization = "Bearer " + user.token;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );