"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  selectedCount: number;
  pageItemsCount: number;
  total: number;
  limit: number;
  totalPages: number;
  onChangeLimit: (n: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function UsersFooter({
  selectedCount,
  pageItemsCount,
  total,
  limit,
  totalPages,
  onChangeLimit,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
      <div className="text-muted-foreground">
        {selectedCount > 0 && (
          <span>
            {selectedCount} of {pageItemsCount} row(s) selected.{" "}
          </span>
        )}
        <span className="ml-2">
          {pageItemsCount} of {total} row(s) total.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="rpp" className=" text-nowrap">
            Rows per page
          </Label>
          <Select
            value={String(limit)}
            onValueChange={(v) => onChangeLimit(Number(v))}
          >
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
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPrev();
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNext();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
