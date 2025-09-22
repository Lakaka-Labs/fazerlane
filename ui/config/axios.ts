import { usePersistStore } from "@/store/persist.store";
import { ApiError, RefreshResponse } from "@/types/api";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const API_BARE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const API_BASE_URL = API_BARE_URL ? `${API_BARE_URL}/api/v1` : "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void): void => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { token: tkObj } = usePersistStore((store) => store);
    const token = tkObj?.jwt;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (
    error: AxiosError<{ message: string; status: number }>
  ): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { token } = usePersistStore((store) => store);

        const refreshToken = token?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.get<RefreshResponse>(
          `${API_BASE_URL}/auth/token/refresh`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { jwt, refreshToken: newRefreshToken } = response.data;

        usePersistStore.getState().setToken({
          jwt,
          ...(newRefreshToken && { refreshToken: newRefreshToken }),
        });

        isRefreshing = false;
        onRefreshed(jwt);

        originalRequest.headers.Authorization = `Bearer ${jwt}`;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        usePersistStore
          .getState()
          .setToken({ jwt: "", refreshToken: undefined });

        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      }
    }

    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.data?.status || error.response?.status,
      code: error.response?.status,
    };

    return Promise.reject(apiError);
  }
);

const apiClient = {
  get: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => api.get<T>(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.put<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => api.delete<T>(url, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.patch<T>(url, data, config).then((response) => response.data),
};

export default apiClient;
