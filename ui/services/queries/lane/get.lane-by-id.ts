import apiClient from "@/config/axios";
import { GetLaneByIDResponse } from "@/types/api/lane";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

interface LanesParams {
  id: string;
}

export async function getLaneByID(params: LanesParams) {
  try {
    const query = buildQuery(`/lane/${params.id}`);

    const res = await apiClient.get<GetLaneByIDResponse>(query);

    return res.data.lane;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to fetch lane by ID"
      );

      throw new Error(
        error.response?.data?.message || "Failed to fetch lane by ID"
      );
    }

    console.error("error nibba", error);
    throw error;
  }
}
