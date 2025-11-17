import apiClient from "@/config/axios";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

interface UnmarkChallengePayload {
  challenge_id: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
}

export async function unmarkChallenge(payload: UnmarkChallengePayload) {
  try {
    const query = buildQuery(`challenge/${payload.challenge_id}/unmark`);

    const res = await apiClient.post<ApiResponse>(query, {});

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to save api key"
      );

      throw new Error(
        error.response?.data?.message || "Failed to save api key"
      );
    }

    console.error("error nibba", error);

    throw error;
  }
}
