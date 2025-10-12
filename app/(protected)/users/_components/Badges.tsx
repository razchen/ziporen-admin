"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { UserStatus, OAuthProvider } from "@/types/user";
import { capitalize } from "@/lib/utils";

export function StatusBadge({ value }: { value: UserStatus }) {
  const map: Record<UserStatus, string> = {
    Active: "bg-emerald-500/45 text-foreground border-none",
    Suspended: "bg-muted text-foreground border-none",
  };
  return (
    <Badge variant="outline" className={`px-2 ${map[value]}`}>
      {value}
    </Badge>
  );
}

export function ProviderBadge({ value }: { value: OAuthProvider }) {
  return (
    <Badge variant="outline" className="px-2">
      {capitalize(value)}
    </Badge>
  );
}

export function VerifiedBadge({ date }: { date: string | null }) {
  const verified = !!date;
  return (
    <Badge
      variant="outline"
      className={`px-2 ${verified ? "bg-emerald-500/45" : "bg-muted"}`}
    >
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
}

export function RolesChips({ roles }: { roles: string[] }) {
  if (!roles?.length) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge key={r} variant="outline" className="px-2">
          {r}
        </Badge>
      ))}
    </div>
  );
}
