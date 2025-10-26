import apiClient from "@/config/axios";
import { LaneCreationResponse } from "@/types/api/lane";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface SubmitTaskQuery {
  challenge_id: string;
}
export interface SubmitTaskData {
  text: string;
  comments: string;
  files: string[];
  useMemory: boolean;
}

export async function submitTask(data: SubmitTaskQuery & SubmitTaskData) {
  try {
    const query = buildQuery(`/challenge/${data.challenge_id}`);

    const res = await apiClient.post<LaneCreationResponse>(query, data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to submit task"
      );

      throw new Error(error.response?.data?.message || "Failed to submit task");
    }

    console.error("error nibba", error);
    throw error;
  }
}
