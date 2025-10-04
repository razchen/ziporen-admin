"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={`px-2 ${active ? "bg-emerald-500/15" : "bg-muted"}`}
    >
      {active ? "Status: Active" : "Status: Inactive"}
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
