"use client";

import DashboardHeader from "./_components/DashboradHeader";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { StatCard } from "./_components/StatCard";
import RevenueCard from "./_components/RevenueCard";
import SalesActivityCard from "./_components/SalesActivityCard";
import SubscriptionsCard from "./_components/SubscriptionCard";
import { Users, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <Separator />

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="New Subscriptions"
            tooltipContent="New subscriptions since last week"
            value={4682}
            sub="Since last week"
            trend={15.54}
            points={[5, 8, 6, 9, 7, 8]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={<ShoppingCart className="h-4 w-4" />}
            title="New Orders"
            tooltipContent="New orders since last week"
            value={1226}
            sub="Since last week"
            trend={-40.2}
            points={[2, 4, 8, 6, 5, 5]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            icon={<ShoppingCart className="h-4 w-4" />}
            title="Avg Order Revenue"
            tooltipContent="Average order revenue since last week"
            value={1080}
            sub="Since last week"
            trend={10.8}
            points={[3, 5, 6, 7, 6, 7]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RevenueCard />
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SalesActivityCard />
        <SubscriptionsCard />
      </div>
    </div>
  );
}
