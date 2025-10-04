import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface KpiProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  change: string;
  tooltipContent: string;
  loading?: boolean; // NEW
}

const Kpi = ({
  title,
  icon,
  value,
  change,
  tooltipContent,
  loading = false,
}: KpiProps) => {
  return (
    <Card className="py-4 gap-1" aria-busy={loading}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex flex-row items-center gap-2 text-sm font-medium">
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
                className="px-1 size-0"
                disabled={loading} // optional
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-1.5">
            <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-32 rounded-md bg-muted/80 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{change}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Kpi;
