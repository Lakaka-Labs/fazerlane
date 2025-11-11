import apiClient from "@/config/axios";
import { FeaturedLaneResponse } from "@/types/api/lane/add.featured";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

export interface LanesData {
  laneId: string;
}

export async function addFeaturedLane(data: LanesData) {
  try {
    const query = buildQuery(`/lane/${data.laneId}/add`);

    const res = await apiClient.post<FeaturedLaneResponse>(query, {});

    return res.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to add to featured lane"
      );

      throw new Error(
        error.response?.data?.message || "Failed to add to featured lane"
      );
    }

    console.error("error nibba", error);

    throw error;
  }
}
