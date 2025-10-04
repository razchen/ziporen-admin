import { baseApi } from "@/services/baseApi";
import { setCredentials, setMe, signOut } from "./auth.slice";
import type { User } from "./auth.types";

type LoginBody = { email: string; password: string };
type RegisterBody = { email: string; password: string; name?: string };

type AuthResponse = { accessToken: string; user: User };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          setCredentials({ accessToken: data.accessToken, user: data.user })
        );
        dispatch(authApi.util.invalidateTags(["Me"]));
      },
    }),
    register: builder.mutation<AuthResponse, RegisterBody>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          setCredentials({ accessToken: data.accessToken, user: data.user })
        );
        dispatch(authApi.util.invalidateTags(["Me"]));
      },
    }),
    me: builder.query<User, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Me"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMe(data));
        } catch {
          // ignore
        }
      },
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(signOut());
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
