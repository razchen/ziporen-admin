import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Calendar,
  LayoutGrid,
  LineChart,
  FileBarChart2,
  Bell,
} from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-[520px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>

          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>

          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileBarChart2 className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>

          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Pick a date
        </Button>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
