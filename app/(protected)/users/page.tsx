"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserPlus } from "lucide-react";
import Kpis from "./_components/Kpis";
import { useListUsersQuery } from "@/features/users/users.api";
import { UserRole } from "@/features/users/users.types";

// --- UI helpers ---

type Status = "Active" | "Inactive" | "Invited";
type Provider = "local" | "google" | "github" | "discord" | string;

function StatusBadge({ value }: { value: Status }) {
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

function ProviderBadge({ value }: { value: Provider }) {
  return (
    <Badge variant="outline" className="px-2">
      {value}
    </Badge>
  );
}

function VerifiedBadge({ date }: { date: string | null }) {
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

function RolesChips({ roles }: { roles: string[] }) {
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

export default function UsersPage() {
  // local UI state
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [role, setRole] = React.useState<string>("all");
  const [hasSubscription, setHasSubscription] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [selected, setSelected] = React.useState<string[]>([]);

  // fetch
  const { data, isLoading, isFetching, isError, refetch } = useListUsersQuery({
    page,
    limit,
    q: query || undefined,
    role: role === "all" ? undefined : (role as UserRole),
    hasSubscription:
      hasSubscription === "all"
        ? undefined
        : hasSubscription === "true"
        ? true
        : false,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil((data?.total ?? 0) / (data?.limit ?? limit))
  );

  // derive table rows from API items
  const rows = (data?.items ?? []).map((u) => {
    const st: Status = u.isActive ? "Active" : "Inactive";

    return {
      id: u.id,
      name: u.name ?? "(no name)",
      email: u.email,
      roles: u.roles ?? [],
      provider: u.provider as Provider,
      emailVerifiedAt: u.emailVerifiedAt
        ? new Date(u.emailVerifiedAt).toISOString()
        : null,
      status: st,
      credits: {
        sub: u.subscriptionCredits ?? 0,
        purchased: u.purchasedCredits ?? 0,
      },
      lastLogin: u.lastLoginAt
        ? new Date(u.lastLoginAt).toLocaleDateString()
        : "—",
      created: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
      planName: u.currentPlan?.name ?? "—",
    };
  });

  const capitalize = (s?: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Kpis />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search users…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
          {/* Status filter (UI only right now, send to backend when you add it) */}
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
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

          {/* Role filter */}
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
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

          {/* Has Subscription filter */}
          <Select
            value={hasSubscription}
            onValueChange={(v) => {
              setHasSubscription(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
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
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="[&>tr>td]:py-3 [&>tr>th]:py-3">
            {isLoading ? (
              // simple skeleton rows
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={9}>
                    <div className="h-6 w-full animate-pulse bg-muted" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className="text-destructive">
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${u.name}`}
                      checked={selected.includes(u.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelected((prev) => [...prev, u.id]);
                        } else {
                          setSelected((prev) =>
                            prev.filter((id) => id !== u.id)
                          );
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Link className="underline" href={`/users/${u.id}`}>
                      {u.name}
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {u.planName}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>

                  <TableCell>
                    <RolesChips
                      roles={u.roles.map((r) => capitalize(r)) as string[]}
                    />
                  </TableCell>

                  <TableCell>
                    <ProviderBadge value={capitalize(u.provider)} />
                  </TableCell>

                  <TableCell>
                    <VerifiedBadge date={u.emailVerifiedAt} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge value={u.status} />
                  </TableCell>

                  <TableCell className="text-muted-foreground tabular-nums">
                    {u.credits.sub}/{u.credits.purchased}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {u.lastLogin}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {u.created}
                  </TableCell>

                  <TableCell className="text-right">
                    {/* actions dropdown (unchanged) */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
          <div className="text-muted-foreground">
            {selected.length > 0 && (
              <span>
                {selected.length} of {items.length} row(s) selected.
              </span>
            )}
            <span className="ml-2">
              {items.length} of {total} row(s) total.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rpp" className=" text-nowrap">
                Rows per page
              </Label>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  const next = Number(v);
                  setLimit(next);
                  setPage(1);
                }}
              >
                <SelectTrigger id="rpp" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
