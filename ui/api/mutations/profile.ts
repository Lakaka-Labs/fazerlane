import { API_BASE_URL } from "@/config/axios";
import { ApiResponse } from "@/types/api";
import axios, { AxiosResponse } from "axios";

interface ForgotPasswordPayload {
  email: string;
}

interface BaseResponse {
  message: string;
}

interface ForgotPasswordData extends BaseResponse {}

export const forgotPasswordM = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<ForgotPasswordData>> => {
  const res: AxiosResponse<ApiResponse<ForgotPasswordData>> = await axios.post(
    `${API_BASE_URL}/profile/password/forgot`,
    payload
  );
  return res.data;
};

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface ResetPasswordData extends BaseResponse {}

export const resetPasswordM = async (
  payload: ResetPasswordPayload
): Promise<ApiResponse<ResetPasswordData>> => {
  const res: AxiosResponse<ApiResponse<ResetPasswordData>> = await axios.patch(
    `${API_BASE_URL}/profile/password/reset?token=${payload.token}`,
    { password: payload.password }
  );
  return res.data;
};

interface VerifyEmailPayload {
  token: string;
}

interface VerifyEmailData extends BaseResponse {}

export const verifyEmailM = async (
  payload: VerifyEmailPayload
): Promise<ApiResponse<VerifyEmailData>> => {
  const res: AxiosResponse<ApiResponse<VerifyEmailData>> = await axios.patch(
    `${API_BASE_URL}/profile/email/verify?token=${payload.token}`
  );
  return res.data;
};

interface ResendVerifyEmailPayload {
  email: string;
}

interface ResendVerifyEmailData extends BaseResponse {}

export const resendVerifyEmailM = async (
  payload: ResendVerifyEmailPayload
): Promise<ApiResponse<ResendVerifyEmailData>> => {
  const res: AxiosResponse<ApiResponse<ResendVerifyEmailData>> =
    await axios.post(`${API_BASE_URL}/profile/email/verify/resend`, payload);
  return res.data;
};
