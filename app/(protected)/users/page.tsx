"use client";

import * as React from "react";
import Kpis from "./_components/Kpis";
import { useListUsersQuery } from "@/features/users/users.api";
import type { UserRole } from "@/features/users/users.types";
import UsersToolbar from "./_components/UsersToolbar";
import UsersTable from "./_components/UsersTable";
import type { Status, Provider, UserRow } from "./_components/types";

export default function UsersPage() {
  // local UI state
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [role, setRole] = React.useState<string>("all");
  const [hasSubscription, setHasSubscription] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [selected, setSelected] = React.useState<string[]>([]);

  // data
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

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (data?.limit ?? limit)));
  const items = data?.items ?? [];

  // derive stable table rows
  const rows = React.useMemo<UserRow[]>(
    () =>
      (items ?? []).map((u) => {
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
          created: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString()
            : "—",
          planName: u.currentPlan?.name ?? "—",
        };
      }),
    [items]
  );

  // handlers (stable)
  const onRefresh = React.useCallback(() => refetch(), [refetch]);
  const onQueryChange = React.useCallback((v: string) => {
    setQuery(v);
    setPage(1);
  }, []);
  const onStatusChange = React.useCallback((v: string) => {
    setStatus(v);
    setPage(1);
  }, []);
  const onRoleChange = React.useCallback((v: string) => {
    setRole(v);
    setPage(1);
  }, []);
  const onHasSubChange = React.useCallback((v: string) => {
    setHasSubscription(v);
    setPage(1);
  }, []);
  const onLimitChange = React.useCallback((next: number) => {
    setLimit(next);
    setPage(1);
  }, []);
  const goPrev = React.useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    []
  );
  const goNext = React.useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages]
  );

  return (
    <div className="space-y-6">
      <Kpis />

      <UsersToolbar
        query={query}
        status={status}
        role={role}
        hasSubscription={hasSubscription}
        isFetching={isFetching}
        onQueryChange={onQueryChange}
        onStatusChange={onStatusChange}
        onRoleChange={onRoleChange}
        onHasSubscriptionChange={onHasSubChange}
        onRefresh={onRefresh}
        onAddUser={() => {
          /* hook your modal/route here */
        }}
      />

      <UsersTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        total={total}
        totalPages={totalPages}
        selectedIds={selected}
        setSelectedIds={setSelected}
        onLimitChange={onLimitChange}
        onPrevPage={goPrev}
        onNextPage={goNext}
      />
    </div>
  );
}
