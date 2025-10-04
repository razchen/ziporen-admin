import * as React from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { toast } from "sonner";

export type RTKError = FetchBaseQueryError | SerializedError | undefined;

// ---- type guards (no any) ----
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
export function isFetchBaseQueryError(e: unknown): e is FetchBaseQueryError {
  return isObject(e) && "status" in e;
}
export function isSerializedError(e: unknown): e is SerializedError {
  return (
    isObject(e) &&
    ("message" in e || "name" in e || "stack" in e || "code" in e)
  );
}

// Useful when you have an `unknown` (e.g., from catch)
export function normalizeRtkError(e: unknown): RTKError {
  if (isFetchBaseQueryError(e)) return e;
  if (isSerializedError(e)) return e;
  return undefined;
}

// ---- extraction (no any) ----
export function extractErrorMessage(e: RTKError): string | undefined {
  if (!e) return undefined;

  if (isFetchBaseQueryError(e)) {
    const data = (e as FetchBaseQueryError & { data?: unknown }).data;

    if (typeof data === "string") return data;

    if (isObject(data)) {
      // common server shapes
      const msg = (() => {
        const m = data["message"];
        if (typeof m === "string") return m;
        const err = data["error"];
        if (typeof err === "string") return err;
        return undefined;
      })();
      if (msg) return msg;
    }

    return typeof e.status === "number"
      ? `Request failed (${e.status})`
      : "Request failed";
  }

  if (isSerializedError(e)) {
    return e.message ?? "Something went wrong";
  }

  return "Unexpected error";
}

// ---- the hook ----
export function useRtkError(error: RTKError) {
  const message = React.useMemo(() => extractErrorMessage(error), [error]);

  function toastFromUnknown(e: unknown, fallback = "Something went wrong") {
    const msg = extractErrorMessage(normalizeRtkError(e)) ?? fallback;
    toast.error(msg);
  }

  return { message, toastFromUnknown };
}
