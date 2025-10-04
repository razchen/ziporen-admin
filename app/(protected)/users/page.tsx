"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, MoreHorizontal, UserPlus, Users } from "lucide-react";
import Kpis from "./_components/Kpis";

// --- Mock data ---

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registered: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Suspended" | "Invited";
  role: "Superadmin" | "Admin" | "Manager" | "Cashier";
};

const rows: UserRow[] = [
  {
    id: "1",
    name: "Ari Kovacek",
    email: "ari_bergstrom@yahoo.com",
    phone: "+14093281927",
    registered: "26 Jun, 2025",
    lastLogin: "07 Aug, 2025",
    status: "Inactive",
    role: "Superadmin",
  },
  {
    id: "2",
    name: "Cindy Wilkinson",
    email: "cindy.zieme@gmail.com",
    phone: "+14877803375",
    registered: "31 Oct, 2024",
    lastLogin: "08 Sep, 2025",
    status: "Suspended",
    role: "Superadmin",
  },
  {
    id: "3",
    name: "Darby Murray",
    email: "darby57@yahoo.com",
    phone: "+17549720689",
    registered: "13 Mar, 2025",
    lastLogin: "16 Sep, 2025",
    status: "Active",
    role: "Superadmin",
  },
  {
    id: "4",
    name: "Jayce Weissnat",
    email: "jayce1@yahoo.com",
    phone: "+16494281096",
    registered: "21 Aug, 2025",
    lastLogin: "01 Oct, 2025",
    status: "Inactive",
    role: "Manager",
  },
  {
    id: "5",
    name: "Myrna Heaney",
    email: "myrna.hayes@yahoo.com",
    phone: "+15424076258",
    registered: "20 Nov, 2024",
    lastLogin: "11 May, 2025",
    status: "Active",
    role: "Superadmin",
  },
  {
    id: "6",
    name: "Johanna Ferry",
    email: "johanna_yost46@yahoo.com",
    phone: "+13344813201",
    registered: "03 Dec, 2024",
    lastLogin: "15 Aug, 2025",
    status: "Suspended",
    role: "Manager",
  },
  {
    id: "7",
    name: "Ivah Walter",
    email: "ivah_bailey@gmail.com",
    phone: "+13572644683",
    registered: "12 Jul, 2025",
    lastLogin: "01 Aug, 2025",
    status: "Active",
    role: "Superadmin",
  },
  {
    id: "8",
    name: "Lisette Ruecker",
    email: "lisette_okon@yahoo.com",
    phone: "+19258306805",
    registered: "05 Jan, 2025",
    lastLogin: "04 Jun, 2025",
    status: "Active",
    role: "Cashier",
  },
  {
    id: "9",
    name: "Viola Osinski",
    email: "viola_smith23@gmail.com",
    phone: "+15362355317",
    registered: "12 Sep, 2025",
    lastLogin: "27 Sep, 2025",
    status: "Invited",
    role: "Manager",
  },
  {
    id: "10",
    name: "Jeanne Ryan",
    email: "jeanne7@yahoo.com",
    phone: "+18693580702",
    registered: "21 Jan, 2025",
    lastLogin: "08 Apr, 2025",
    status: "Invited",
    role: "Manager",
  },
];

function StatusBadge({ value }: { value: UserRow["status"] }) {
  const map: Record<UserRow["status"], string> = {
    Active: "bg-emerald-500/15 text-foreground border-none",
    Inactive: "bg-muted text-foreground border-none",
    Suspended: "bg-destructive/15 text-foreground border-none",
    Invited: "bg-primary/15 text-foreground border-none",
  };
  return (
    <Badge variant="outline" className={`px-2 ${map[value]}`}>
      {value}
    </Badge>
  );
}

function RoleChip({ value }: { value: UserRow["role"] }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <Users className="h-3.5 w-3.5" />
      {value}
    </div>
  );
}

export default function UsersPage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [role, setRole] = React.useState<string>("all");

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    const matchesQ =
      !q || [r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(q));
    const matchesStatus = status === "all" || r.status.toLowerCase() === status;
    const matchesRole = role === "all" || r.role.toLowerCase() === role;
    return matchesQ && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header & actions row lives in Navbar */}

      {/* KPI Cards */}
      <Kpis />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Filter tasks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Status
          </Button>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Registered Date</TableHead>
              <TableHead>Last Login Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Checkbox aria-label={`Select ${u.name}`} />
                </TableCell>
                <TableCell>
                  <Link className="underline" href={`/users/${u.id}`}>
                    {u.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.registered}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.lastLogin}
                </TableCell>
                <TableCell>
                  <StatusBadge value={u.status} />
                </TableCell>
                <TableCell>
                  <RoleChip value={u.role} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Row actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/users/${u.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Disable</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
          <div className="text-muted-foreground">0 of 30 row(s) selected.</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rpp" className="text-xs">
                Rows per page
              </Label>
              <Select defaultValue="10">
                <SelectTrigger id="rpp" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
