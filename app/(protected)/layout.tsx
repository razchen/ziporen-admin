import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen">
        <div className="flex">
          {/* Left rail */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0">
            <Navbar />
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
