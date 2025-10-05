export enum UserStatus {
  Active = "Active",
  Suspended = "Suspended",
}

export type UserRole = "SUPERADMIN" | "ADMIN" | "USER";

export type OAuthProvider = "local" | "google" | "apple" | "discord";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  provider: OAuthProvider;
  emailVerifiedAt: string | null;
  status: UserStatus;
  credits: { sub: number; purchased: number };
  lastLogin: string;
  created: string;
  planName: string;
};
