"use client";

import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Left rail */}
        <div className="hidden md:block">
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Main column */}
        <div className="flex-1 min-w-0">
          <Navbar
            onToggleSidebar={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
          />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
