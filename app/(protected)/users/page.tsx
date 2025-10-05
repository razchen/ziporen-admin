"use client";

import * as React from "react";
import Kpis from "./_components/Kpis";
import { useListUsersQuery } from "@/features/users/users.api";
import UsersToolbar from "./_components/UsersToolbar";
import UsersTable from "./_components/UsersTable";
import type { UserStatus, OAuthProvider, UserRow } from "@/types/user";
import AdminBreadcrumbs from "@/components/common/AdminBreakcrumbs";
import CreateUserDialog from "./_components/CreateUserDialog";
import { UserRole } from "@/types/user";

export default function UsersPage() {
  // local UI state
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [role, setRole] = React.useState<string>("all");
  const [hasSubscription, setHasSubscription] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [showCreate, setShowCreate] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"name" | "email" | "createdAt">(
    "createdAt"
  );
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  // data
  const { data, isLoading, isFetching, isError, refetch } = useListUsersQuery({
    page,
    limit,
    q: query || undefined,
    sortBy,
    sortDir,
    status: status === "all" ? undefined : (status as UserStatus),
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
  const items = React.useMemo(() => data?.items ?? [], [data?.items]);

  const onSortChange = React.useCallback(
    (col: "name" | "email" | "createdAt") => {
      setPage(1);

      // derive next values from current values
      const same = sortBy === col;
      const nextDir = same
        ? sortDir === "asc"
          ? "desc"
          : "asc"
        : col === "createdAt"
        ? "desc"
        : "asc";

      setSortBy(col);
      setSortDir(nextDir);
    },
    [sortBy, sortDir]
  );

  // derive stable table rows
  const rows = React.useMemo<UserRow[]>(
    () =>
      (items ?? []).map((u) => {
        return {
          id: u.id,
          name: u.name ?? "(no name)",
          email: u.email,
          roles: u.roles ?? [],
          provider: u.provider as OAuthProvider,
          emailVerifiedAt: u.emailVerifiedAt
            ? new Date(u.emailVerifiedAt).toISOString()
            : null,
          status: u.status,
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
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Users", current: true },
        ]}
      />

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
          setShowCreate(true);
        }}
      />

      <UsersTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        total={total}
        selectedIds={selected}
        setSelectedIds={setSelected}
        onLimitChange={onLimitChange}
        onPrevPage={goPrev}
        onNextPage={goNext}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={onSortChange}
      />

      <CreateUserDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={() => refetch()}
      />
    </div>
  );
}
