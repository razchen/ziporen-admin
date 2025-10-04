"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";

type Props = {
  query: string;
  status: string;
  role: string;
  hasSubscription: string;
  isFetching: boolean;
  onQueryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onHasSubscriptionChange: (v: string) => void;
  onRefresh: () => void;
  onAddUser: () => void;
};

export default function UsersToolbar({
  query,
  status,
  role,
  hasSubscription,
  isFetching,
  onQueryChange,
  onStatusChange,
  onRoleChange,
  onHasSubscriptionChange,
  onRefresh,
  onAddUser,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search users…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="max-w-xs"
        />

        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
          </SelectContent>
        </Select>

        {/* Role */}
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        {/* Has subscription */}
        <Select value={hasSubscription} onValueChange={onHasSubscriptionChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Has Subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subscriptions</SelectItem>
            <SelectItem value="true">Has subscription</SelectItem>
            <SelectItem value="false">No subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onAddUser}
        >
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>
    </div>
  );
}
