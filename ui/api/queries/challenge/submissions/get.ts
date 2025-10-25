import apiClient from "@/config/axios";
import { GetAttemptsResponse } from "@/types/api/challenges/submissions";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface SubmissionQuery {
  challenge_id: string;
}
export interface SubmissionParam {
  limit?: number;
  page?: number;
}

export async function getSubmissions(data: SubmissionQuery & SubmissionParam) {
  try {
    const query = buildQuery(`/challenge/${data.challenge_id}/attempts`, {
      limit: data.limit,
      page: data.page,
    });

    const res = await apiClient.get<GetAttemptsResponse>(query);

    console.log("res", res);

    return res.data.attempts;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to get submissions"
      );

      throw new Error(
        error.response?.data?.message || "Failed to get submissions"
      );
    }

    console.error("error nibba", error);
    throw error;
  }
}
