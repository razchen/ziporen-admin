import type {
  Pagination,
  UserDto,
  ListUsersParams,
  UsersKpis,
  GetUsersKpisParams,
} from "./users.types";
import { baseApi } from "@/services/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<Pagination<UserDto>, ListUsersParams | void>({
      query: (params) => {
        console.log(params);
        const {
          page,
          limit,
          q,
          role,
          status,
          hasSubscription,
          sortBy,
          sortDir,
        } = params ?? {};
        return {
          url: "/admin/users",
          params: {
            page,
            limit,
            q,
            role,
            status,
            hasSubscription,
            sortBy,
            sortDir,
          },
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          JSON.stringify(currentArg ?? {}) !== JSON.stringify(previousArg ?? {})
        );
      },
    }),

    getUser: builder.query<UserDto, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (r, e, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<
      UserDto,
      Partial<UserDto> & { password: string }
    >({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      UserDto,
      { id: string; data: Partial<UserDto> & { password?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (r, e, { id }) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    usersKpis: builder.query<UsersKpis, GetUsersKpisParams | void>({
      query: (params) => {
        const windowDays = params?.windowDays ?? 30;
        const activeBucket = params?.activeBucket ?? "mau";
        return {
          url: "/admin/users/kpis",
          params: { windowDays, activeBucket },
        };
      },
      // Cache-separate by params so toggling 7d/30d or DAU/WAU/MAU doesn’t clash
      providesTags: (r, e, args) => [
        {
          type: "Kpis",
          id: `window:${args?.windowDays ?? 30}-bucket:${
            args?.activeBucket ?? "mau"
          }`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUsersKpisQuery,
} = usersApi;
