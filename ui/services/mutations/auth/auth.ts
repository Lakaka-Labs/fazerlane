import { API_BARE_URL } from "@/config/routes";
import { ApiResponse } from "@/types/api";
import axios, { AxiosResponse } from "axios";

interface AuthPayload {
  email: string;
  password: string;
}

interface SignupPayload extends AuthPayload {
  username: string;
}

interface AuthData {
  jwt: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    password: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    apiKey: string | null;
    customPrompt: string | null;
  };
}

export const signUpM = async (
  payload: SignupPayload
): Promise<ApiResponse<AuthData>> => {
  const res: AxiosResponse<ApiResponse<AuthData>> = await axios.post(
    `${API_BARE_URL}/auth/signup`,
    payload,
    { withCredentials: true }
  );
  return res.data;
};

export const signInM = async (
  payload: AuthPayload
): Promise<ApiResponse<AuthData>> => {
  const res: AxiosResponse<ApiResponse<AuthData>> = await axios.post(
    `${API_BARE_URL}/auth/login`,
    payload,
    // Without this the browser drops the Set-Cookie from a cross-origin login,
    // leaving the previous session's cookies in place.
    { withCredentials: true }
  );
  return res.data;
};
