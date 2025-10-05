import { OAuthProvider, UserStatus, UserRole } from "@/types/user";

export type PlanDto = {
  id: number;
  name: string;
};

export type SortBy = "name" | "email" | "createdAt";
export type SortDir = "asc" | "desc";

export type UserDto = {
  id: string;
  name: string | null;
  email: string;

  roles: UserRole[]; // enum array from DB (JSON)
  provider: OAuthProvider; // 'local' | 'google' | ...
  providerId: string | null;

  status: UserStatus;
  emailVerifiedAt: string | null; // ISO string or null
  lastLoginAt: string | null; // ISO string or null

  subscriptionCredits: number;
  purchasedCredits: number;

  avatarUrl: string | null;
  stripeCustomerId: string | null;

  currentPlan?: PlanDto | null;

  notes: string | null;

  createdAt: string; // ISO
  updatedAt: string; // ISO
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
  role?: UserRole;
  status?: UserStatus;
  hasSubscription?: boolean;
  sortBy?: SortBy;
  sortDir?: SortDir;
};

// src/features/users/users.types.ts
export type ActiveBucket = "dau" | "wau" | "mau";

export type UsersKpis = {
  totalUsers: number;
  newUsers: number;
  newUsersChangePct: number; // 0..1 (e.g., 0.12 = +12%)
  subscribedUsers: number;
  subscribedUsersChangePct: number; // 0..1
  activeUsers: number; // DAU/WAU/MAU depending on activeBucket
  activeUsersChangePct: number; // 0..1
};

export type GetUsersKpisParams = {
  windowDays?: 7 | 30; // defaults to 30
  activeBucket?: ActiveBucket; // defaults to "mau"
};
