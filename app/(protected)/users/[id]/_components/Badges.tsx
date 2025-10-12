"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: UserStatus }) {
  const isActive = status === UserStatus.Active;
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2",
        isActive
          ? "bg-success-soft text-success-foreground border-transparent"
          : "bg-muted text-muted-foreground border-transparent"
      )}
    >
      {isActive ? "Status: Active" : "Status: Inactive"}
    </Badge>
  );
}

export function VerifiedBadge({ date }: { date: string | null }) {
  const verified = !!date;
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2",
        verified
          ? "bg-success-soft text-success-foreground border-transparent"
          : "bg-muted text-muted-foreground border-transparent"
      )}
    >
      {verified ? "Email Verified" : "Unverified"}
    </Badge>
  );
}
