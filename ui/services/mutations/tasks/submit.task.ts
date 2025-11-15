import { getCurrentToken } from "@/config/axios";
import { API_BASE_URL } from "@/config/routes";
import { LaneCreationResponse } from "@/types/api/lane";
import { buildQuery } from "@/utils/api";
import axios, { AxiosError } from "axios";

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
    // const query = buildQuery(`/challenge/${data.challenge_id}`);
    const query = buildQuery(`${API_BASE_URL}/challenge/${data.challenge_id}`);
    const tkObj = getCurrentToken();

    if (!tkObj) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }

      throw new Error("No authentication token found");
    }

    console.log({ data });

    const res = await axios.post<LaneCreationResponse>(query, data, {
      headers: {
        Authorization: `Bearer ${tkObj.token}`,
      },
    });

    return res.data.data;
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
