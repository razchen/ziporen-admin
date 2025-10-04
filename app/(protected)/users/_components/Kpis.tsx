"use client";

import * as React from "react";
import { Users, UserPlus, BadgeDollarSign, Activity } from "lucide-react";
import Kpi from "@/components/common/Kpi";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUsersKpisQuery } from "@/features/users/users.api";
import { UsersKpis } from "@/features/users/users.types";

type ActiveBucket = "dau" | "wau" | "mau";

// ---- utils ----
const fmt = (n?: number) =>
  typeof n === "number" ? Intl.NumberFormat().format(n) : "—";

const pct = (p?: number) =>
  typeof p === "number" ? `${p >= 0 ? "+" : ""}${(p * 100).toFixed(1)}%` : "—";

const Kpis: React.FC = () => {
  // UI controls
  const [windowDays, setWindowDays] = React.useState<7 | 30>(30);
  const [activeBucket, setActiveBucket] = React.useState<ActiveBucket>("mau");

  // Fetch KPIs
  const { data, isLoading, isFetching, isError, refetch } = useUsersKpisQuery({
    windowDays,
    activeBucket,
  });

  const k: UsersKpis | undefined = data;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={String(windowDays)}
            onValueChange={(v) => {
              if (v === "7" || v === "30") setWindowDays(Number(v) as 7 | 30);
            }}
            className="bg-muted/40 rounded-md p-1"
          >
            <ToggleGroupItem value="7" className="px-3">
              7d
            </ToggleGroupItem>
            <ToggleGroupItem value="30" className="px-3">
              30d
            </ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            type="single"
            value={activeBucket}
            onValueChange={(v) => {
              if (v === "dau" || v === "wau" || v === "mau") setActiveBucket(v);
            }}
            className="bg-muted/40 rounded-md p-1 ml-2"
          >
            <ToggleGroupItem value="dau" className="px-3">
              DAU
            </ToggleGroupItem>
            <ToggleGroupItem value="wau" className="px-3">
              WAU
            </ToggleGroupItem>
            <ToggleGroupItem value="mau" className="px-3">
              MAU
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi
          title="Total Users"
          icon={<Users className="h-4 w-4" />}
          value={isLoading || isError ? "—" : fmt(k?.totalUsers)}
          change={""}
          tooltipContent="Total number of users in the system"
          loading={isLoading}
        />

        <Kpi
          title={`New Users (${windowDays}d)`}
          icon={<UserPlus className="h-4 w-4" />}
          value={isLoading || isError ? "—" : fmt(k?.newUsers)}
          change={
            isLoading || isError
              ? ""
              : `${pct(k?.newUsersChangePct)} vs prev ${windowDays}d`
          }
          tooltipContent={`Users created in the last ${windowDays} days`}
          loading={isLoading}
        />

        <Kpi
          title="Subscribed Users"
          icon={<BadgeDollarSign className="h-4 w-4" />}
          value={isLoading || isError ? "—" : fmt(k?.subscribedUsers)}
          change={
            isLoading || isError
              ? ""
              : `${pct(k?.subscribedUsersChangePct)} vs prev ${windowDays}d`
          }
          tooltipContent="Users with an active subscription"
          loading={isLoading}
        />

        <Kpi
          title={`${activeBucket.toUpperCase()} (Active Users)`}
          icon={<Activity className="h-4 w-4" />}
          value={isLoading || isError ? "—" : fmt(k?.activeUsers)}
          change={
            isLoading || isError
              ? ""
              : `${pct(k?.activeUsersChangePct)} vs prev ${windowDays}d`
          }
          tooltipContent={`Distinct users with key activity in the last window (${activeBucket.toUpperCase()})`}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default Kpis;
