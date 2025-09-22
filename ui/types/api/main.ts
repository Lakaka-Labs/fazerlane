export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  jwt: string;
  refreshToken: string;
}

export interface LoginResponse {
  jwt: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  jwt: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string | number;
  error?: {
    details: {
      message: string;
    }[];
  };
}

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    details: {
      message: string;
    }[];
  };
}
