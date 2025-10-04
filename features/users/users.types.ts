export type UserRole = "Superadmin" | "Admin" | "Manager" | "Cashier" | "User";

export type UserDto = {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;
  roles: UserRole[];
  // add other fields exposed by your entity (password is excluded via serializer)
};

export type Pagination<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type ListUsersParams = {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  status?: string;
};
