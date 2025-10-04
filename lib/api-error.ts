import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return typeof e === "object" && e != null && "status" in e;
}

export function isSerializedError(e: unknown): e is SerializedError {
  return (
    typeof e === "object" &&
    e != null &&
    ("message" in e || "name" in e || "stack" in e || "code" in e)
  );
}

export function extractErrorMessage(
  e: FetchBaseQueryError | SerializedError | undefined
): string | undefined {
  if (!e) return undefined;
  if (isFetchBaseQueryError(e)) {
    const data = (e as FetchBaseQueryError & { data?: unknown }).data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === "string") return m;
    }
    if (data && typeof data === "object" && "error" in data) {
      const m = (data as { error?: unknown }).error;
      if (typeof m === "string") return m;
    }
    return typeof (e as FetchBaseQueryError).status === "number"
      ? `Request failed (${(e as FetchBaseQueryError).status})`
      : "Request failed";
  }
  if (isSerializedError(e)) return e.message ?? "Something went wrong";
  return "Unexpected error";
}
