import apiClient from "@/config/axios";
import { RemoveLaneResponse } from "@/types/api/lane/delete";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface LanesData {
  laneId: string;
}

export async function removeLane(data: LanesData) {
  try {
    const query = buildQuery(`/lane/${data.laneId}/remove`);

    const res = await apiClient.delete<RemoveLaneResponse>(query);

    return res.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to delete lane"
      );

      throw new Error(error.response?.data?.message || "Failed to delete lane");
    }

    console.error("error nibba", error);
    throw error;
  }
}
