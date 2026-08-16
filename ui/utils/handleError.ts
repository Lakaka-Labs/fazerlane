"use client";

import { AxiosError } from "axios";
import toast from "react-hot-toast";

const FALLBACK_MESSAGE = "Something went wrong, try again";

/**
 * Last line of defence for messages that arrive over a stream, where there is no
 * axios interceptor in between. A provider that fails inside the server hands us
 * its raw JSON body, and dumping that into a toast is unreadable — so pull the
 * message out of it when we can and fall back to plain copy when we can't.
 */
export function toReadableMessage(raw: unknown): string {
  const text = typeof raw === "string" ? raw.trim() : "";

  if (!text) return FALLBACK_MESSAGE;
  if (!text.startsWith("{") && !text.startsWith("[")) return text;

  try {
    const parsed = JSON.parse(text);
    const message = parsed?.error?.message ?? parsed?.message;

    return typeof message === "string" && message ? message : FALLBACK_MESSAGE;
  } catch {
    return FALLBACK_MESSAGE;
  }
}

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
