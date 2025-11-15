import apiClient from "@/config/axios";
import { RedoLaneResponse } from "@/types/api/lane/redo";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface LanesData {
  laneId: string;
}

export async function redoLane(data: LanesData) {
  try {
    const query = buildQuery(`/lane/${data.laneId}`);

    const res = await apiClient.put<RedoLaneResponse>(query, {});

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to retry lane"
      );

      throw new Error(error.response?.data?.message || "Failed to retry lane");
    }

    console.error("error nibba", error);
    throw error;
  }
}
