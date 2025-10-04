export type Status = "Active" | "Inactive" | "Invited";
export type Provider = "local" | "google" | "github" | "discord" | string;

export type UserRow = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  provider: Provider;
  emailVerifiedAt: string | null;
  status: Status;
  credits: { sub: number; purchased: number };
  lastLogin: string;
  created: string;
  planName: string;
};
