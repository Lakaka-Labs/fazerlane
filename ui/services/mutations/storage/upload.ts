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

    const res = await axios.post<ApiResponse>(query, files, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      withCredentials: true,
    });

    console.log("res from inside upload file ", res);

    return res.data.data.ids;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to upload files"
      );
    }

    console.error("error nibba", error);
  }
}
