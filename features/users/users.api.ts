// src/features/users/users.api.ts
import type { Pagination, UserDto, ListUsersParams } from "./users.types";
import { baseApi } from "@/services/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<Pagination<UserDto>, ListUsersParams | void>({
      query: (params) => {
        const { page, limit, q, role, status } = params ?? {};
        return {
          url: "/admin/users",
          params: { page, limit, q, role, status },
        };
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
  }),
  overrideExisting: false,
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
