"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectIsAuthed } from "@/features/auth/auth.slice";
import { useMeQuery, useLogoutMutation } from "@/features/auth/auth.api";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutGrid,
  ListTodo,
  Users,
  Shield,
  Bug,
  Settings,
  Code2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// --- utils ---
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// --- Types & Data ---

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  heading: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    heading: "General",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "Users", href: "/users", icon: Users },
      { label: "Tasks", href: "/tasks", icon: ListTodo },
    ],
  },
  {
    heading: "Pages",
    items: [
      { label: "Channel Rank", href: "/channel-rank", icon: Bug },
      { label: "Auth", href: "/auth", icon: Shield },
    ],
  },
  {
    heading: "Other",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Developers", href: "/developers", icon: Code2 },
    ],
  },
];

export default function Sidebar({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const user = useAppSelector(selectUser);
  const isAuthed = useAppSelector(selectIsAuthed);
  const router = useRouter();

  // keep user fresh after page loads
  useMeQuery(undefined, { skip: !isAuthed });

  const pathname = usePathname();

  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "User";
  const initials = (user?.name ?? user?.email ?? "User")
    .split(/[.@\s_-]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  return (
    <div
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "group h-screen flex flex-col border-r overflow-hidden",
        // smooth width animation
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="px-3 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 grid place-items-center rounded-md border px-3">
            <span className="text-sm font-semibold">S</span>
          </div>

          {/* Keep in DOM and animate text on collapse */}
          <div
            aria-hidden={collapsed}
            className={cn(
              "min-w-0",
              "transition-[opacity,transform] duration-200",
              collapsed
                ? "opacity-0 -translate-x-2 pointer-events-none select-none"
                : "opacity-100 translate-x-0"
            )}
          >
            <p className="truncate text-sm font-semibold leading-tight">
              Ziporen - Admin
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Thumbnails LLM
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Nav list */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-6 py-4">
          {NAV.map((section) => (
            <div key={section.heading}>
              {/* Section heading animates in/out */}
              <div
                className={cn(
                  "overflow-hidden", // clip while height animates
                  "transition-[max-height,margin,opacity,transform] duration-300 ease-in-out",
                  collapsed
                    ? "max-h-0 opacity-0 -translate-x-2 mb-0"
                    : "max-h-6 opacity-100 translate-x-0 mb-2"
                )}
              >
                <p className="px-2 text-xs font-medium text-muted-foreground">
                  {section.heading}
                </p>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname?.startsWith(item.href) ?? false;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />

                      {/* Label animates instead of disappearing */}
                      <span
                        aria-hidden={collapsed}
                        className={cn(
                          "whitespace-nowrap",
                          "transition-[opacity,transform] duration-200",
                          collapsed
                            ? "opacity-0 -translate-x-2 pointer-events-none select-none"
                            : "opacity-100 translate-x-0"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Account area */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://i.pravatar.cc/64?img=12"
                  alt="avatar"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              {/* User block animates on collapse */}
              <div
                aria-hidden={collapsed}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2",
                  "transition-[opacity,transform] duration-200",
                  collapsed
                    ? "opacity-0 -translate-x-2 pointer-events-none select-none"
                    : "opacity-100 translate-x-0"
                )}
              >
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-medium leading-tight">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 flex-shrink-0" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" side="top" className="w-72">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://i.pravatar.cc/64?img=12"
                    alt="avatar"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notifications">Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  logout().unwrap();
                  router.push("/auth/signin");
                } catch (e) {
                  toast.error("Failed to log out");
                  console.error(e);
                }
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
