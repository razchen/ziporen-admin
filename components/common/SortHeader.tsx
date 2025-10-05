import * as React from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

export type SortDir = "asc" | "desc";

export type SortHeaderProps<T extends string> = {
  label: string;
  col: T;
  sortBy: T;
  sortDir: SortDir;
  onSortChange: (c: T) => void;
  /** Direction to use when switching to a new column (default: "asc") */
  defaultDir?: (c: T) => SortDir;
};

export function SortHeader<T extends string>({
  label,
  col,
  sortBy,
  sortDir,
  onSortChange,
  defaultDir,
}: SortHeaderProps<T>) {
  const active = sortBy === col;

  const ariaSort: React.AriaAttributes["aria-sort"] = active
    ? sortDir === "asc"
      ? "ascending"
      : "descending"
    : undefined;

  const Icon = !active
    ? ArrowUpDown
    : sortDir === "asc"
    ? ChevronUp
    : ChevronDown;

  // Next direction = toggle when same column, otherwise use defaultDir or "asc"
  const nextDir: SortDir = active
    ? sortDir === "asc"
      ? "desc"
      : "asc"
    : defaultDir?.(col) ?? "asc";

  const srText = active
    ? `${label}, sorted ${sortDir}. Activate to sort ${nextDir}.`
    : `${label}, not sorted. Activate to sort ${nextDir}.`;

  return (
    <TableHead aria-sort={ariaSort} className="whitespace-nowrap select-none">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 hover:underline ${
          active ? "font-medium" : ""
        }`}
        onClick={() => onSortChange(col)}
        aria-label={srText}
      >
        <span>{label}</span>
        <Icon
          className={`h-3.5 w-3.5 ${active ? "" : "opacity-60"}`}
          aria-hidden
        />
      </button>
    </TableHead>
  );
}
