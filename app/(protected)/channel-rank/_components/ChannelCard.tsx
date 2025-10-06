"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScorePicker from "./ScorePicker";
import type { ChannelWithCandidatesDto } from "@/types/channel-rank";

type Props = {
  data: ChannelWithCandidatesDto;
  onScore: (score: number) => void;
  isSubmitting?: boolean;
};

export default function ChannelCard({ data, onScore, isSubmitting }: Props) {
  const excerpt = (title: string) => title.slice(0, 40) + "…";
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">{data.channelTitle}</CardTitle>
          <div className="text-sm text-muted-foreground">{data.channelId}</div>
        </div>
        <Badge variant="secondary">
          {Intl.NumberFormat().format(data.subscribers)} subs
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 3x3 grid of thumbnails */}
        <div className="grid grid-cols-3 gap-2">
          {data.items.map((t) => (
            <div key={t.thumbnailId}>
              <div className="text-sm">{excerpt(t.title)}</div>
              <div
                key={t.thumbnailId}
                className="relative aspect-video overflow-hidden rounded-lg border"
              >
                {/* Use next/image for perf if the URLs are remote and allowed. */}
                <Image
                  src={t.imageUrl}
                  alt={t.videoId}
                  fill
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-1 right-1 text-xs bg-background/70 backdrop-blur px-1.5 py-0.5 rounded">
                  {t.engagement != null ? t.engagement.toFixed(2) : "—"}
                </div>
              </div>
            </div>
          ))}
          {data.items.length === 0 && (
            <div className="col-span-3 text-sm text-muted-foreground">
              No eligible thumbnails.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <ScorePicker onChange={onScore} disabled={isSubmitting} />
          <Button variant="secondary" size="sm" disabled title="Coming later">
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
