"use client";

import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line } from "recharts";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const Trend = ({ value }: { value: number }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <span className={positive ? "text-emerald-400" : "text-rose-400"}>
        <Icon className="h-4 w-4" />
      </span>
      <span className={positive ? "text-emerald-400" : "text-rose-400"}>
        {Math.abs(value).toFixed(1)}%
      </span>
    </div>
  );
};

export function SparkLine({
  points,
  positive = true,
}: {
  points: number[];
  positive?: boolean;
}) {
  const data = points.map((y, i) => ({ i, y }));
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 6, bottom: 0, left: 0, right: 0 }}
        >
          <XAxis dataKey="i" hide tickLine={false} axisLine={false} />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="y"
            stroke={positive ? "#34d399" : "#fb7185"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatCard({
  icon,
  title,
  tooltipContent,
  value,
  sub,
  trend,
  points,
}: {
  icon?: React.ReactNode;
  title: string;
  tooltipContent?: string;
  value: string | number;
  sub?: string;
  trend?: number;
  points?: number[];
}) {
  const positive = (trend ?? 0) >= 0;
  return (
    <Card className="border-grey-300 py-2 gap-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More info"
                  className="px-1"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-semibold tracking-tight">{value}</div>
            {sub && <div className="text-xs text-neutral-400 mt-1">{sub}</div>}
          </div>

          <div className="w-1/4">
            {points && (
              <div className="mt-3">
                <SparkLine points={points} positive={positive} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="link" className="px-0 mt-2 text-sm">
            Details
          </Button>
          {typeof trend === "number" && <Trend value={trend} />}
        </div>
      </CardContent>
    </Card>
  );
}
