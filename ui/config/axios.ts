import { ApiError, RefreshResponse } from "@/types/api";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BARE_URL, API_BASE_URL } from "./routes";
import { persistStore } from "@/store/persist.store";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

// Read the jwt per request, never once at module load: a sign-in is a
// client-side navigation, so a token captured when the bundle evaluated would
// stay stale (empty, or the previous session's) for the whole tab and send
// every call into the 401 -> refresh -> logout loop.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    config.withCredentials = true;

    const jwt = persistStore.getState().session.jwt;
    if (jwt) {
      config.headers.set("Authorization", `Bearer ${jwt}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (
    error: AxiosError<{ message: string; status: number; code?: string }>
  ): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.data?.code === "AI_RATE_LIMIT") {
      persistStore.getState().setShowRateLimitPrompt(true);

      const apiError: ApiError = {
        message: error.response.data.message,
        status: error.response.status,
        code: error.response.data.code,
      };

      return Promise.reject(apiError);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/token/refresh")
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = persistStore.getState().session.refreshToken;
        const res = await axios.get<RefreshResponse>(
          `${API_BARE_URL}/auth/token/refresh`,

          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          }
        );

        // Persist the new jwt, otherwise the retry below (and every later
        // call) re-sends the token that just 401'd.
        const { session, setSession } = persistStore.getState();
        setSession({ ...session, jwt: res.data.data.jwt });

        isRefreshing = false;
        onRefreshed(res.data.data.jwt);

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        isRefreshing = false;

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }

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
