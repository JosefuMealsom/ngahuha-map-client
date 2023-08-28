import { Axios } from 'axios';

const axiosInstance = new Axios({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

export const axios = axiosInstance;
