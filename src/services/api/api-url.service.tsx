class ApiUrlService {
  getFullPath(path: string) {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    const apiUrl = new URL('/', baseUrl);
    apiUrl.pathname = path;
    return apiUrl.toString();
  }
}

export default new ApiUrlService();
