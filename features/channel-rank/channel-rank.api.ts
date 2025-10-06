// src/features/channel-rank/channel-rank.api.ts
import { baseRankApi } from "@/services/baseRankApi";
import type {
  NextBatchResponseDto,
  UpsertChannelRankDto,
} from "./channel-rank.types";

export const channelRankApi = baseRankApi.injectEndpoints({
  endpoints: (builder) => ({
    getNextBatch: builder.query<
      NextBatchResponseDto,
      {
        offset?: number;
        limit?: number;
        order?: "subscribers_desc" | "recent_activity" | "none";
      }
    >({
      query: ({ offset = 0, limit = 30, order = "subscribers_desc" }) => ({
        url: `/admin/channel-rank/next-batch`,
        params: { offset, limit, order },
      }),
    }),

    upsertRank: builder.mutation<
      { channelId: string; score: number },
      UpsertChannelRankDto
    >({
      query: (body) => ({
        url: `/admin/channel-rank`,
        method: "POST",
        body,
      }),
      async onQueryStarted({ channelId }, { dispatch, queryFulfilled }) {
        // Default optimistic update for the common args; in your page, pass the same args if you paginate.
        const args = {
          offset: 0,
          limit: 30,
          order: "subscribers_desc" as const,
        };
        const patch = dispatch(
          channelRankApi.util.updateQueryData("getNextBatch", args, (draft) => {
            draft.items = draft.items.filter((c) => c.channelId !== channelId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetNextBatchQuery, useUpsertRankMutation } = channelRankApi;
