"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function SubscriptionsCard() {
  const data = Array.from({ length: 8 }).map((_, i) => ({
    name: `W${i + 1}`,
    mrr: Math.round(10 + Math.random() * 30),
    subs: Math.round(4 + Math.random() * 18),
  }));
  return (
    <Card className="border-grey-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <div className="text-xl font-semibold mt-2">+2350</div>
            <p className="text-sm text-neutral-400">+180.1% from last month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              {/* no CartesianGrid */}
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#0B1220",
                  border: "1px solid #1f2937",
                }}
              />
              <Bar dataKey="mrr" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="subs" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
