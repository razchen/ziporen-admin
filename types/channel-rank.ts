export type CandidateThumbDto = {
  thumbnailId: string;
  videoId: string;
  imageUrl: string;
  width: number;
  height: number;
  title: string;
  engagement: number | null;
};

export type ChannelWithCandidatesDto = {
  channelId: string;
  channelTitle: string;
  subscribers: number;
  items: CandidateThumbDto[]; // up to 9
};

export type NextBatchResponseDto = {
  items: ChannelWithCandidatesDto[];
  offset: number;
  limit: number;
  order: "subscribers_desc" | "recent_activity" | "none";
};

export type UpsertChannelRankDto = {
  channelId: string;
  score: number; // 0..5
};
