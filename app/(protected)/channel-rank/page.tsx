"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChannelCard from "./_components/ChannelCard";
import {
  useGetNextBatchQuery,
  useUpsertRankMutation,
  channelRankApi,
} from "@/features/channel-rank/channel-rank.api";
import type { ChannelWithCandidatesDto } from "@/features/channel-rank/channel-rank.types";
import { useAppDispatch } from "@/store/hooks";
import { useRtkError } from "@/hooks/useRtkError";

export default function ChannelRankPage() {
  const limit = 30;
  const [offset, setOffset] = React.useState(0);
  const [idx, setIdx] = React.useState(0); // index within current batch
  const order = "subscribers_desc" as const;

  const dispatch = useAppDispatch();
  const { data, isFetching, refetch, isError, error } = useGetNextBatchQuery({
    offset,
    limit,
    order,
  });
  const [upsertRank, { isLoading: isSaving }] = useUpsertRankMutation();
  const { toastFromUnknown } = useRtkError(error);

  const items = data?.items ?? [];
  const current: ChannelWithCandidatesDto | undefined = items[idx];

  // Prefetch next batch when we’re near the end (<= 3 left)
  React.useEffect(() => {
    if (items.length && idx >= Math.max(0, items.length - 3)) {
      const nextArgs = { offset: offset + limit, limit, order };
      dispatch(
        channelRankApi.util.prefetch("getNextBatch", nextArgs, { force: true })
      );
    }
  }, [idx, items.length, offset, limit, order, dispatch]);

  // Move to next channel (advance index or flip to next batch)
  const gotoNext = React.useCallback(() => {
    if (idx + 1 < items.length) {
      setIdx((i) => i + 1);
    } else {
      // Finished this batch → jump to next batch, reset index
      setOffset((o) => o + limit);
      setIdx(0);
    }
  }, [idx, items.length, limit]);

  const gotoPrev = React.useCallback(() => {
    if (idx > 0) setIdx((i) => i - 1);
    else if (offset > 0) {
      // Go to previous batch and show its last item
      const prevOffset = Math.max(0, offset - limit);
      setOffset(prevOffset);
      // wait a tick for data change to avoid showing wrong index
      setIdx(0);
    }
  }, [idx, offset, limit]);

  // Keyboard shortcuts: 0-5
  React.useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (!current || isSaving) return;
      // digits 0..5 only
      if (e.key >= "0" && e.key <= "5") {
        e.preventDefault();
        const score = Number(e.key);
        try {
          await upsertRank({ channelId: current.channelId, score }).unwrap();
          toast.success(`Scored ${current.channelTitle} = ${score}`);
          // Optimistically remove from cache for current args (optional)
          dispatch(
            channelRankApi.util.updateQueryData(
              "getNextBatch",
              { offset, limit, order },
              (draft) => {
                draft.items = draft.items.filter(
                  (c) => c.channelId !== current.channelId
                );
              }
            )
          );
          gotoNext();
        } catch (err) {
          toastFromUnknown(err);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    current,
    isSaving,
    upsertRank,
    toastFromUnknown,
    dispatch,
    offset,
    limit,
    order,
    gotoNext,
  ]);

  // Manual click handler (ScorePicker buttons inside ChannelCard)
  const handleScore = async (
    channel: ChannelWithCandidatesDto,
    score: number
  ) => {
    try {
      await upsertRank({ channelId: channel.channelId, score }).unwrap();
      toast.success(`Scored ${channel.channelTitle} = ${score}`);
      dispatch(
        channelRankApi.util.updateQueryData(
          "getNextBatch",
          { offset, limit, order },
          (draft) => {
            draft.items = draft.items.filter(
              (c) => c.channelId !== channel.channelId
            );
          }
        )
      );
      gotoNext();
    } catch (e: unknown) {
      toastFromUnknown(e);
    }
  };

  const hasPrevBatch = offset > 0;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Channel Rank</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (idx > 0) setIdx((i) => i - 1);
              else if (hasPrevBatch) {
                setOffset((o) => Math.max(0, o - limit));
                setIdx(0);
              }
            }}
            disabled={isFetching || (!hasPrevBatch && idx === 0)}
          >
            Prev
          </Button>
          <Button
            variant="default"
            onClick={gotoNext}
            disabled={isFetching || !current}
            title="Next (auto when you score)"
          >
            Next
          </Button>
        </div>
      </div>

      <Separator />

      {isError && <div className="text-destructive">Failed to load.</div>}
      {isFetching && !current && (
        <div className="text-muted-foreground">Loading…</div>
      )}

      {/* Single-channel view */}
      {current ? (
        <div className="max-w-5xl">
          <ChannelCard
            data={current}
            onScore={(s) => handleScore(current, s)}
            isSubmitting={isSaving}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Tip: Use keys <kbd>0</kbd>–<kbd>5</kbd> to score quickly.
          </div>
        </div>
      ) : (
        !isFetching && (
          <div className="text-muted-foreground">
            No unranked channels found.
          </div>
        )
      )}
    </div>
  );
}
