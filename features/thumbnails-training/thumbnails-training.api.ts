import { baseRankApi } from "@/services/baseRankApi";
import { ThumbnailsTrainingResponseDto } from "./thumbnail-training.types";

export const thumbnailsTrainingApi = baseRankApi.injectEndpoints({
  endpoints: (builder) => ({
    getThumbnailsTraining: builder.query<
      ThumbnailsTrainingResponseDto,
      {
        page?: number;
        limit?: number;
        order?: "createdAt";
      }
    >({
      query: ({ page = 1, limit = 30, order = "createdAt" }) => ({
        url: `/admin/thumbnails`,
        params: { page, limit, order },
      }),
    }),
  }),
});

export const { useGetThumbnailsTrainingQuery } = thumbnailsTrainingApi;
