"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Search, Bell, PanelLeft } from "lucide-react";

export default function Navbar({
  onToggleSidebar,
  collapsed,
}: {
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  // ⌘/Ctrl + K focuses search
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      if (
        (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-15 items-center gap-3 px-3 justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:inline-flex"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div>
          {/* Mobile sidebar trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open sidebar">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                {/* Mount your Sidebar inside for mobile */}
                {/* <Sidebar /> */}
              </SheetContent>
            </Sheet>
          </div>

          {/* Search */}
          <div className="ml-auto md:ml-6 flex-1 md:flex-none">
            <div className="relative max-w-sm">
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4" />
              </span>
              <Input
                ref={searchRef}
                className="pl-8"
                placeholder="Search"
                aria-label="Search"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border px-1.5 text-[10px] font-medium md:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme toggle placeholder (implement your own) */}
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <Sun className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator />
    </header>
  );
}
