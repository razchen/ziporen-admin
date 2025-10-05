"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user";

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge
      variant="outline"
      className={`px-2 ${
        status === UserStatus.Active ? "bg-emerald-500/15" : "bg-muted"
      }`}
    >
      {status === UserStatus.Active ? "Status: Active" : "Status: Inactive"}
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
      {verified ? "Email Verified" : "Unverified"}
    </Badge>
  );
}
