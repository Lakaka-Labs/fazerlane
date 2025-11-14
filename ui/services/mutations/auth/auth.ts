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
  };
}

export const signUpM = async (
  payload: SignupPayload
): Promise<ApiResponse<AuthData>> => {
  const res: AxiosResponse<ApiResponse<AuthData>> = await axios.post(
    `${API_BARE_URL}/auth/signup`,
    payload
  );
  return res.data;
};

export const signInM = async (
  payload: AuthPayload
): Promise<ApiResponse<AuthData>> => {
  const res: AxiosResponse<ApiResponse<AuthData>> = await axios.post(
    `${API_BARE_URL}/auth/login`,
    payload
  );
  return res.data;
};
