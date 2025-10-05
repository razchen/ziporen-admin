"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import BootstrapAuth from "@/components/auth/BootstrapAuth";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // Lock viewport height; only main area scrolls
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Fixed left rail (doesn't participate in layout flow) */}
        <aside className="hidden md:block fixed inset-y-0 left-0 z-40">
          <Sidebar collapsed={collapsed} />
        </aside>

        {/* Spacer that *does* participate in layout and animates width */}
        <div
          aria-hidden
          className={cn(
            "hidden md:block",
            "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
            collapsed ? "w-16" : "w-72"
          )}
        />

        {/* Main column fills the rest */}
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <Navbar
            onToggleSidebar={() => setCollapsed((v) => !v)}
            collapsed={collapsed}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <BootstrapAuth>{children}</BootstrapAuth>
          </main>
        </div>
      </div>
    </div>
  );
}
