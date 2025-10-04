"use client";

import * as React from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ProviderBadge,
  RolesChips,
  StatusBadge,
  VerifiedBadge,
} from "./Badges";
import { UserRow } from "./types";

type Props = {
  rows: UserRow[];
  isLoading: boolean;
  isError: boolean;
  limit: number;
  total: number;
  totalPages: number;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onLimitChange: (n: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function UsersTable({
  rows,
  isLoading,
  isError,
  limit,
  total,
  totalPages,
  selectedIds,
  setSelectedIds,
  onLimitChange,
  onPrevPage,
  onNextPage,
}: Props) {
  const itemsOnPage = rows.length;

  const toggleSelect = React.useCallback(
    (id: string, checked: boolean | "indeterminate") => {
      if (checked)
        setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      else setSelectedIds((prev) => prev.filter((x) => x !== id));
    },
    [setSelectedIds]
  );

  return (
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
            Array.from({ length: limit }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                <TableCell colSpan={12}>
                  <div className="h-6 w-full animate-pulse bg-muted" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={12} className="text-destructive">
                Failed to load users.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${u.name}`}
                    checked={selectedIds.includes(u.id)}
                    onCheckedChange={(c) => toggleSelect(u.id, c)}
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
                  <RolesChips roles={u.roles.map(capitalize)} />
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
                  {/* row actions here */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
        <div className="text-muted-foreground">
          {selectedIds.length > 0 && (
            <span>
              {selectedIds.length} of {itemsOnPage} row(s) selected.
            </span>
          )}
          <span className="ml-2">
            {itemsOnPage} of {total} row(s) total.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="rpp" className=" text-nowrap">
              Rows per page
            </Label>
            <Select
              value={String(limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
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
                    onPrevPage();
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

// local util (keeps the same look you had)
function capitalize(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
