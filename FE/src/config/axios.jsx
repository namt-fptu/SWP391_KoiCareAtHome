import axios from "axios";
import { AUTH_LOCALSTORAGE_KEY } from "../page/(auth)/store";
const baseUrl = "http://localhost:5088/api/";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

// handle before call API
const handleBefore = (config) => {
  try {
    const authData = localStorage.getItem(AUTH_LOCALSTORAGE_KEY);
    if (authData) {
      const parsedData = JSON.parse(authData);
      const accessToken = parsedData?.state?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch (error) {
    console.error("Failed to set authorization header:", error);
  }

  // const token = localStorage.getItem(AUTH_LOCALSTORAGE_KEY)?.replaceAll('"', "");
  // config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore, null);

export default api;
