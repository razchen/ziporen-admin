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
  const order = "subscribers_desc" as const;
  const initialArgs = { offset: 0, limit, order };

  const dispatch = useAppDispatch();
  const { data, isFetching, refetch, isError, error } =
    useGetNextBatchQuery(initialArgs);
  const [upsertRank, { isLoading: isSaving }] = useUpsertRankMutation();
  const { toastFromUnknown } = useRtkError(error);

  // Local queue of channels to review
  const [queue, setQueue] = React.useState<ChannelWithCandidatesDto[]>([]);

  // On first load or refetch, seed the queue (dedupe by channelId, keep existing first)
  React.useEffect(() => {
    if (!data?.items) return;
    setQueue((prev) => {
      const seen = new Set(prev.map((c) => c.channelId));
      const next = [...prev];
      for (const c of data.items) {
        if (!seen.has(c.channelId)) next.push(c);
      }
      return next;
    });
  }, [data?.items]);

  // Subscribe to a second batch when queue is low (<= 3 items left)
  const needMore = queue.length <= 3;
  const {
    data: refillData,
    isFetching: isFetchingRefill,
    isError: isRefillError,
  } = useGetNextBatchQuery(initialArgs, { skip: !needMore });

  // When refill arrives, append new (dedup)
  React.useEffect(() => {
    if (!refillData?.items || !needMore) return;
    setQueue((prev) => {
      const seen = new Set(prev.map((c) => c.channelId));
      const appended = refillData.items.filter((c) => !seen.has(c.channelId));
      return [...prev, ...appended];
    });
  }, [refillData?.items, needMore]);

  const current = queue[0];

  // Score helpers
  const removeCurrent = React.useCallback(
    (channelId: string) => {
      setQueue((prev) => prev.filter((c) => c.channelId !== channelId));
      // Optionally: also update RTK cache to keep list views in sync
      dispatch(
        channelRankApi.util.updateQueryData(
          "getNextBatch",
          initialArgs,
          (draft) => {
            draft.items = draft.items.filter((c) => c.channelId !== channelId);
          }
        )
      );
    },
    [dispatch]
  ); // initialArgs is stable literals here

  // Keyboard 0–5
  React.useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (!current || isSaving) return;
      if (e.key >= "0" && e.key <= "5") {
        e.preventDefault();
        const score = Number(e.key);
        try {
          await upsertRank({ channelId: current.channelId, score }).unwrap();
          toast.success(`Scored ${current.channelTitle} = ${score}`);
          removeCurrent(current.channelId);
        } catch (err) {
          toastFromUnknown(err);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, isSaving, upsertRank, toastFromUnknown, removeCurrent]);

  // Manual score (buttons)
  const handleScore = async (
    channel: ChannelWithCandidatesDto,
    score: number
  ) => {
    try {
      await upsertRank({ channelId: channel.channelId, score }).unwrap();
      toast.success(`Scored ${channel.channelTitle} = ${score}`);
      removeCurrent(channel.channelId);
    } catch (e: unknown) {
      toastFromUnknown(e);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div>
            Queue: {queue.length} {needMore && "(need more)"}
          </div>
          <div>Refill: {refillData?.items?.length}</div>
        </div>
        <h1 className="text-xl font-semibold">Channel Rank</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Separator />

      {isError && <div className="text-destructive">Failed to load.</div>}
      {isFetching && queue.length === 0 && (
        <div className="text-muted-foreground">Loading…</div>
      )}

      {/* Single-channel view from the queue */}
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

      {/* tiny footer hint */}
      {needMore &&
        (isFetchingRefill ? (
          <div className="text-xs text-muted-foreground">
            Loading next batch…
          </div>
        ) : isRefillError ? (
          <div className="text-xs text-muted-foreground">
            Couldn’t load more.
          </div>
        ) : null)}
    </div>
  );
}
