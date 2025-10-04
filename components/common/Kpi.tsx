import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
interface KpiProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  change: string;
  tooltipContent: string;
}

const Kpi = ({ title, icon, value, change, tooltipContent }: KpiProps) => {
  return (
    <Card className="py-4 gap-1">
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
                aria-label="Notifications"
                className="px-1 size-0"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
};

export default Kpi;
