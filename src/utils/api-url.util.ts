class ApiUrlUtil {
  getFullPath(path: string, query?: { [propName: string]: any }) {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    const apiUrl = new URL('/', baseUrl);
    apiUrl.pathname = path;
    if (query) {
      apiUrl.search = new URLSearchParams(query).toString();
    }
    return apiUrl.toString();
  }
}

export default new ApiUrlUtil();
