"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { currency } from "@/lib/utils";

export default function RevenueCard() {
  const data = [
    { name: "Jan", v: 11000 },
    { name: "Feb", v: 11800 },
    { name: "Mar", v: 10400 },
    { name: "Apr", v: 10150 },
    { name: "May", v: 10300 },
    { name: "Jun", v: 15231 },
  ];
  return (
    <Card className="border-grey-300 py-4 gap-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-4xl font-semibold tracking-tight">
          {currency(15231.89)}
        </div>
        <div className="text-xs text-neutral-400 mt-1">
          +20.1% from last month
        </div>
        <div className="h-10 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 6, bottom: 0, left: 0, right: 0 }}
            >
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => currency(Number(v))}
                contentStyle={{
                  background: "#0B1220",
                  border: "1px solid #1f2937",
                }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
