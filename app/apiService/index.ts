import axios from "axios";

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

// apiService.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     let errStatus: number | null = null;

//     if (error.response) {
//       errStatus = error.response.status;
//     }

//     if (errStatus) {
//       if (errStatus === errorStatusEnum.UNAUTHORIZED) {
//         window.localStorage.clear();

//         if (window.location.pathname === '/') return;

//         window.location.href = '/auth';
//         toast.error('Não autorizado! Faça login para continuar');
//       }

//       if (errStatus === errorStatusEnum.INTERNAL_SERVER_ERROR) {
//         toast.error('Um erro aconteceu, peça ajuda para o suporte.');
//       }
//     }

//     return Promise.reject(error);
//   }
// );
