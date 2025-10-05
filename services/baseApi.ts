import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { setCredentials, signOut } from "@/features/auth/auth.slice";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";

// --- base query that adds bearer when we have it ---
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

type RefreshResponse = { accessToken?: string };

// --- single-flight refresh guard so multiple 401s don't spam /auth/refresh ---
let refreshPromise: Promise<string | null> | null = null;

async function getFreshAccessToken(api: BaseQueryApi): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        {}
      );

      if ("error" in res && res.error) {
        const status = res.error.status as number | undefined;
        if (status === 401 || status === 403) {
          api.dispatch(signOut());
          if (typeof window !== "undefined")
            window.location.replace("/auth/signin");
          return null;
        }
      }

      const accessToken = (res as { data?: RefreshResponse }).data?.accessToken;
      if (accessToken) {
        api.dispatch(setCredentials({ accessToken }));
        return accessToken;
      }

      api.dispatch(signOut());
      if (typeof window !== "undefined") {
        window.location.replace("/auth/signin");
      }
      return null;
    })().finally(() => {
      // allow a new refresh after this one settles
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    });
  }
  return refreshPromise;
}

const isAuthEndpoint = (args: string | FetchArgs): boolean => {
  const url = typeof args === "string" ? args : args.url;
  if (!url) return false;
  return (
    url.startsWith("/auth/refresh") ||
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/logout")
  );
};

const baseQueryWithReauth: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    !isAuthEndpoint(args as string | FetchArgs)
  ) {
    const token = await getFreshAccessToken(api);
    if (token) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Users", "User", "Kpis"],
  endpoints: () => ({}),
});
