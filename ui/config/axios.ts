import { persistStore } from "@/store/persist.store";
import { ApiError, RefreshResponse } from "@/types/api";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "./routes";

const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

const setCookie = (
  name: string,
  value: string,
  options: {
    expires?: number;
    path?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
): void => {
  const defaultOptions = {
    expires: 7,
    path: "/",
    secure: true,
    sameSite: "strict" as const,
    ...options,
  };

  Cookies.set(name, value, defaultOptions);
};

const deleteCookie = (name: string, path: string = "/"): void => {
  Cookies.remove(name, { path });
};

const getTokenFromCookies = (): {
  token: string;
  refreshToken: string;
} | null => {
  const token = getCookie("token");
  const refreshToken = getCookie("refreshToken");

  if (token && refreshToken) {
    return { token, refreshToken };
  }

  return null;
};

const getTokenFromStore = () => {
  try {
    const tkObj = persistStore.getState().token;
    console.log("token from store", tkObj);

    return tkObj?.jwt
      ? { token: tkObj.jwt, refreshToken: tkObj.refreshToken }
      : null;
  } catch (error) {
    console.warn("Failed to access store tokens:", error);
    return null;
  }
};

const getCurrentToken = (): { token: string; refreshToken?: string } | null => {
  const cookieTokens = getTokenFromCookies();
  if (cookieTokens) {
    return {
      token: cookieTokens.token,
      refreshToken: cookieTokens.refreshToken,
    };
  }

  const storeTokens = getTokenFromStore();
  if (storeTokens) {
    return { token: storeTokens.token, refreshToken: storeTokens.refreshToken };
  }

  return null;
};

const updateTokens = (jwt: string, refreshToken?: string): void => {
  const cookieTokens = getTokenFromCookies();

  if (cookieTokens) {
    setCookie("token", jwt);
    if (refreshToken) {
      setCookie("refreshToken", refreshToken);
    }
  } else {
    try {
      persistStore.setState({
        token: {
          jwt,
          ...(refreshToken && { refreshToken }),
        },
      });
    } catch (error) {
      console.warn("Failed to update store tokens:", error);
    }
  }
};

const clearTokens = (): void => {
  deleteCookie("token");
  deleteCookie("refreshToken");

  try {
    persistStore.setState({ token: { jwt: "", refreshToken: undefined } });
  } catch (error) {
    console.warn("Failed to clear store tokens:", error);
  }
};

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
    const tokenData = getCurrentToken();

    if (tokenData?.token) {
      config.headers.Authorization = `Bearer ${tokenData.token}`;
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
        const tokenData = getCurrentToken();
        const refreshToken = tokenData?.refreshToken;

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

        updateTokens(jwt, newRefreshToken);

        isRefreshing = false;
        onRefreshed(jwt);

        originalRequest.headers.Authorization = `Bearer ${jwt}`;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        clearTokens();

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

export const setTokensToCookies = (
  token: string,
  refreshToken: string
): void => {
  setCookie("token", token, { expires: 7 });
  setCookie("refreshToken", refreshToken, { expires: 30 });
};

export const clearAllTokens = (): void => {
  clearTokens();
};

export default apiClient;
