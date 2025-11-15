import apiClient from "@/config/axios";
import { GetChallengeResponse } from "@/types/api/challenges";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface ChallengeQuery {
  lane_id: string;
}
export interface ChallengeParam {
  limit?: number;
  page?: number;
}

export async function getChallenges(data: ChallengeQuery & ChallengeParam) {
  try {
    const query = buildQuery(`/challenge/lane/${data.lane_id}`, {
      limit: data.limit,
      page: data.page,
    });

    const res = await apiClient.get<GetChallengeResponse>(query);

    console.log("res", res);

    return res.data.challenges;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to get challenges"
      );

      throw new Error(
        error.response?.data?.message || "Failed to get challenges"
      );
    }

    console.error("error nibba", error);
    throw error;
  }
}
