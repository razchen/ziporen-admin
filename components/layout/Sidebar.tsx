"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      { label: "Tasks", href: "/tasks", icon: ListTodo },
      { label: "Users", href: "/users", icon: Users },
    ],
  },
  {
    heading: "Pages",
    items: [
      { label: "Auth", href: "/auth", icon: Shield },
      { label: "Errors", href: "/errors", icon: Bug },
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

// --- Components ---

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
        (active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground")
      }
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r">
      <div className="px-3 pb-2 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 grid place-items-center rounded-md border">
            <span className="text-sm font-semibold">S</span>
          </div>
          <div className="min-w-0">
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

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-6 py-4">
          {NAV.map((section) => (
            <div key={section.heading}>
              <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
                {section.heading}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={pathname?.startsWith(item.href) ?? false}
                  />
                ))}
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
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium leading-tight">
                  ausrobdev
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  rob@shadcnblocks.com
                </p>
              </div>
              <ChevronDown className="ml-auto h-4 w-4" />
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
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    ausrobdev
                  </p>
                  <p className="text-xs text-muted-foreground">
                    rob@shadcnblocks.com
                  </p>
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
            <DropdownMenuItem asChild>
              <button type="button" className="w-full text-left">
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
