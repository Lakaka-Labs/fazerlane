import { getCurrentToken } from "@/config/axios";
import { API_BASE_URL } from "@/config/routes";
import { buildQuery } from "@/utils/api";
import axios, { AxiosError } from "axios";

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    ids: string[];
  };
}

export async function uploadFile(files: FormData) {
  try {
    const query = buildQuery(`${API_BASE_URL}/storage`);
    const tkObj = getCurrentToken();

    if (!tkObj) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }

      throw new Error("No authentication token found");
    }

    const res = await axios.post<ApiResponse>(query, files, {
      headers: {
        Authorization: `Bearer ${tkObj.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data.ids;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to upload files"
      );

      throw new Error(
        error.response?.data?.message || "Failed to upload files"
      );
    }

    console.error("error nibba", error);
    throw error;
  }
}
