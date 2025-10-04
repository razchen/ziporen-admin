import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import { setCredentials, signOut } from "@/features/auth/auth.slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.yourapp.com
  credentials: "include", // if you use httpOnly refresh cookies
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extra) => {
  let result = await rawBaseQuery(args, api, extra);

  if (result.error && result.error.status === 401) {
    // try refresh
    const refresh = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extra
    );
    if (refresh.data) {
      const { accessToken } = refresh.data as { accessToken: string };
      api.dispatch(setCredentials({ accessToken }));
      // retry original
      result = await rawBaseQuery(args, api, extra);
    } else {
      api.dispatch(signOut());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Users", "User", "Kpis"], // ⬅️ add these
  endpoints: () => ({}),
});
