"use client";

import * as React from "react";
import Image from "next/image";
import type { UserDto } from "@/features/users/users.types";
import { UserCircle2 } from "lucide-react";
import { StatusBadge } from "./Badges";

export default function UserHeader({ user }: { user: UserDto }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {user.avatarUrl && user.avatarUrl.startsWith("http") ? (
          <Image
            src={user.avatarUrl}
            alt={user.name ?? user.email}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <UserCircle2 className="h-10 w-10 text-muted-foreground" />
        )}
        <div>
          <h1 className="text-xl font-semibold">
            User Details: {user.name ?? user.email}
          </h1>
          <p className="text-sm text-muted-foreground">{user.id}</p>
        </div>
      </div>

      <StatusBadge status={user.status} />
    </div>
  );
}
