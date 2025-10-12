export type ThumbnailTrainingDto = {
  videoId: string;
  title: string;
  styleBucket: string;
  thumbnail_s3_url: string;
  caption: string;
};

export type ThumbnailsTrainingResponseDto = {
  items: ThumbnailTrainingDto[];
  offset: number;
  limit: number;
  total: number;
};
