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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, MoreHorizontal, UserPlus, Users } from "lucide-react";
import Kpis from "./_components/Kpis";
import { useListUsersQuery } from "@/features/users/users.api";

// --- UI helpers ---

type Status = "Active" | "Inactive" | "Suspended" | "Invited";
type Role = "Superadmin" | "Admin" | "Manager" | "Cashier";

function StatusBadge({ value }: { value: Status }) {
  const map: Record<Status, string> = {
    Active: "bg-emerald-500/15 text-foreground border-none",
    Inactive: "bg-muted text-foreground border-none",
    Suspended: "bg-destructive/15 text-foreground border-none",
    Invited: "bg-primary/15 text-foreground border-none",
  };
  return (
    <Badge variant="outline" className={`px-2 ${map[value]}`}>
      {value}
    </Badge>
  );
}

function RoleChip({ value }: { value: Role }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <Users className="h-3.5 w-3.5" />
      {value}
    </div>
  );
}

export default function UsersPage() {
  // local UI state
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [role, setRole] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // fetch
  const { data, isLoading, isFetching, isError, refetch } = useListUsersQuery({
    page,
    limit,
    q: query || undefined,
    role: role === "all" ? undefined : role,
    status: status === "all" ? undefined : status,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil((data?.total ?? 0) / (data?.limit ?? limit))
  );

  // derive table rows from API items
  const rows = items.map((u) => {
    // Derivations until you add real fields in the backend:
    const primaryRole = (u.roles?.[0] as Role | undefined) ?? "Admin";
    const derivedStatus: Status = "Active"; // replace when backend provides status
    return {
      id: u.id,
      name: u.name ?? "(no name)",
      email: u.email,
      phone: (u as any).phone ?? "", // adapt if you have phone on your entity
      registered: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString()
        : "—",
      lastLogin: (u as any).lastLoginAt
        ? new Date((u as any).lastLoginAt).toLocaleDateString()
        : "—",
      status: derivedStatus,
      role: primaryRole,
    } as {
      id: string;
      name: string;
      email: string;
      phone: string;
      registered: string;
      lastLogin: string;
      status: Status;
      role: Role;
    };
  });

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
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
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
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Registered Date</TableHead>
              <TableHead>Last Login Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
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
                    <Checkbox aria-label={`Select ${u.name}`} />
                  </TableCell>
                  <TableCell>
                    <Link className="underline" href={`/users/${u.id}`}>
                      {u.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.registered}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.lastLogin}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={u.status} />
                  </TableCell>
                  <TableCell>
                    <RoleChip value={u.role} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Row actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${u.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Disable</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
          <div className="text-muted-foreground">
            {/* TODO: wire to your checkbox selection state */}0 of{" "}
            {items.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rpp" className="text-xs">
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

                {/* Simple numeric pager (1..3 + ellipsis) */}
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                {page + 1 <= totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {page + 2 <= totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 2);
                      }}
                    >
                      {page + 2}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {page + 3 <= totalPages && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

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

            <div className="text-muted-foreground tabular-nums">
              {total > 0
                ? `Showing ${(page - 1) * limit + 1}–${Math.min(
                    page * limit,
                    total
                  )} of ${total}`
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
