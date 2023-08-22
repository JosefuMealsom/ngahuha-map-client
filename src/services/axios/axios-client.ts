import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw Error(
      error.response.data.statusCode + ': ' + error.response.data.message,
    );
  },
);

export default axiosClient;
