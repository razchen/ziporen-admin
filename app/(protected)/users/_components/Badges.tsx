"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { Status, Provider } from "./types";

export function StatusBadge({ value }: { value: Status }) {
  const map: Record<Status, string> = {
    Active: "bg-emerald-500/15 text-foreground border-none",
    Inactive: "bg-muted text-foreground border-none",
    Invited: "bg-primary/15 text-foreground border-none",
  };
  return (
    <Badge variant="outline" className={`px-2 ${map[value]}`}>
      {value}
    </Badge>
  );
}

export function ProviderBadge({ value }: { value: Provider }) {
  return (
    <Badge variant="outline" className="px-2">
      {value}
    </Badge>
  );
}

export function VerifiedBadge({ date }: { date: string | null }) {
  const verified = !!date;
  return (
    <Badge
      variant="outline"
      className={`px-2 ${verified ? "bg-emerald-500/15" : "bg-muted"}`}
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
