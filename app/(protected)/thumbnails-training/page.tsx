"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useGetThumbnailsTrainingQuery } from "@/features/thumbnails-training/thumbnails-training.api";
import ThumbnailTrainingCard from "./_components/ThumbnailTrainingCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ThumbnailsTrainingPage() {
  const LIMIT = 28;
  const initialArgs = { page: 1, limit: LIMIT };
  const [page, setPage] = React.useState(1);

  const { data, isFetching, isError } = useGetThumbnailsTrainingQuery({
    ...initialArgs,
    page,
  });

  const totalPages = Math.ceil((data?.total || 0) / LIMIT);

  const items = data?.items || [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Thumbnails Training</h1>
      </div>

      <Separator />

      {isError && <div className="text-destructive">Failed to load.</div>}
      {isFetching && <div className="text-muted-foreground">Loading…</div>}

      {/* Single-channel view from the queue */}
      {items?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ThumbnailTrainingCard
                key={item.videoId}
                title={item.title}
                styleBucket={item.styleBucket}
                url={item.thumbnail_s3_url}
                caption={item.caption}
              />
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {page > 1 && (
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page - 1);
                    }}
                  />
                )}
              </PaginationItem>
              <PaginationItem>
                {page < totalPages && (
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        !isFetching && (
          <div className="text-muted-foreground">No thumbnails found.</div>
        )
      )}
    </div>
  );
}
