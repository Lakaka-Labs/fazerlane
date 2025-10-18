import { cookies } from "next/headers";

export async function getServerTokens() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  return token && refreshToken ? { token, refreshToken } : null;
}
