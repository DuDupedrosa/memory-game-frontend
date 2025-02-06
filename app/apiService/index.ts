import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { toast } from "sonner";

export const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers
      ? (config.headers.Authorization = `Bearer ${token}`)
      : (config.headers =
          config.headers || `Bearer ${token}` || "application/json");
  }
  return config;
});

apiService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let errStatus: number | null = null;

    if (error.response) {
      errStatus = error.response.status;
    }

    if (errStatus) {
      if (errStatus === HttpStatusCode.Unauthorized) {
        //toast.error("Unauthorized! Required Login.");
        window.localStorage.clear();
        window.location.href = "/auth";
        window.localStorage.setItem("unauthorized", "true");
      }

      if (errStatus === HttpStatusCode.InternalServerError) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }

    return Promise.reject(error);
  }
);
