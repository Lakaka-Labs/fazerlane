import apiClient from "@/config/axios";
import { buildQuery } from "@/utils/api";
import { AxiosError } from "axios";

interface UpdateProfilePayload {
  username: string;
  // email: string;
}

interface UpdateProfileData {
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}

export const updateProfileM = async (payload: UpdateProfilePayload) => {
  const query = buildQuery("/profile/username");

  const data = { key: payload.username };

  const res = await apiClient.put<UpdateProfileData>(query, data);
  return res.data;
};

// update api key

interface UpdateApiKeyData {
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}

interface UpdateApiKeyPayload {
  apiKey: string;
}

export const updateApiKeyM = async (payload: UpdateApiKeyPayload) => {
  try {
    const query = buildQuery("/profile/key");

    const data = { key: payload.apiKey };

    const res = await apiClient.put<UpdateApiKeyData>(query, data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to save api key"
      );

      throw new Error(
        error.response?.data?.message || "Failed to save api key"
      );
    }

    console.error("error nibba", error);

    throw error;
  }
};

// delete api key

interface DeleteApiKeyData {
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}

export const deleteApiKeyM = async () => {
  try {
    const query = buildQuery(`/profile/key`);
    const res = await apiClient.delete<DeleteApiKeyData>(query);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to delete api key"
      );

      throw new Error(
        error.response?.data?.message || "Failed to delete api key"
      );
    }

    console.error("error nibba", error);

    throw error;
  }
};

// custom prompt

interface UpdateCustomPromptPayload {
  customPrompt: string;
}

interface UpdateCustomPromptData {
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}

export const updateCustomPromptM = async (
  payload: UpdateCustomPromptPayload
) => {
  try {
    const query = buildQuery("/profile/prompt");

    const data = { prompt: payload.customPrompt };

    const res = await apiClient.put<UpdateCustomPromptData>(query, data);

    console.log("custom prompt resp", res);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "error nibba",
        error.response?.data?.message || "Failed to update custom prompt"
      );

      throw new Error(
        error.response?.data?.message || "Failed to update custom prompt"
      );
    }

    console.error("error nibba", error);

    throw error;
  }
};
