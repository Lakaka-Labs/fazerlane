"use client";

import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function handleError(
  error: unknown,
  route?: string,
  istoast?: boolean,
  rethrow?: boolean
): string {
  console.log("error in ", route);

  if (error instanceof AxiosError) {
    const aerr = error.response?.data?.message || "Operation failed";
    console.error("axios error nibba", aerr);

    if (istoast) {
      toast.error(aerr);
    }

    if (rethrow) {
      throw new Error(aerr);
    }

    return aerr;
  } else {
    const nerr = String(error || "Operation failed");
    console.error("error nibba", nerr);

    if (istoast) {
      toast.error(nerr);
    }

    if (rethrow) {
      throw nerr;
    }
    return String(nerr);
  }
}
