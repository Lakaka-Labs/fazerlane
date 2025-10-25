import apiClient from "@/config/axios";
import { GetLaneResponse } from "@/types/api/lane";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

interface LanesParams {
  limit?: number;
  page?: number;
}

export async function getLanes(params: LanesParams) {
  try {
    const query = buildQuery("/lane", params);

    const res = await apiClient.get<GetLaneResponse>(query);

    return res.data.lanes;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to fetch lanes"
      );

      throw new Error(error.response?.data?.message || "Failed to fetch lanes");
    }

    console.error("error nibba", error);
    throw error;
  }
}
