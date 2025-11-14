import { API_BARE_URL } from "@/config/routes";

export const googleLoginQ = () => {
  window.location.href = `${API_BARE_URL}/auth/google`;
};
