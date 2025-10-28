import apiClient from "@/config/axios";
import { LaneCreationResponse } from "@/types/api/lane";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface LanesData {
  youtube: string;
  startTime?: string;
  endTime?: string;
}

export async function createLane(data: LanesData) {
  try {
    const query = buildQuery("/lane");

    const res = await apiClient.post<LaneCreationResponse>(query, data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to create lane"
      );

      throw new Error(error.response?.data?.message || "Failed to create lane");
    }

    console.error("error nibba", error);

    throw error;
  }
}
