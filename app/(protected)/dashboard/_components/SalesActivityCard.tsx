"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SalesActivityCard() {
  const data = [
    { name: "Jan", a: 12, b: 4 },
    { name: "Feb", a: 26, b: 10 },
    { name: "Mar", a: 14, b: 6 },
    { name: "Apr", a: 18, b: 12 },
    { name: "May", a: 22, b: 11 },
    { name: "Jun", a: 22, b: 13 },
  ];
  return (
    <Card className="border-grey-300 col-span-2">
      <CardHeader>
        <CardTitle>Sale Activity - Monthly</CardTitle>
        <p className="text-sm text-neutral-400">
          Showing total sales for the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                hide
              />
              <YAxis stroke="#6b7280" tickLine={false} axisLine={false} hide />
              <Tooltip
                contentStyle={{
                  background: "#0B1220",
                  border: "1px solid #1f2937",
                }}
              />
              <Area
                type="monotone"
                dataKey="a"
                stroke="#1d4ed8"
                fill="url(#gA)"
              />
              <Area
                type="monotone"
                dataKey="b"
                stroke="#10b981"
                fill="url(#gB)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
