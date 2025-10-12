import Image from "next/image";

interface ThumbnailTrainingCardProps {
  title: string;
  url: string;
  styleBucket: string;
  caption: string;
}

const ThumbnailTrainingCard = ({
  title,
  url,
  styleBucket,
  caption,
}: ThumbnailTrainingCardProps) => {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nOScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSIjZWVlIi8+PC9zdmc+"
        />

        {/* subtle bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent opacity-80" />

        {/* style badge */}
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white shadow">
          {styleBucket}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1.5 p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">
          {title}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
};

export default ThumbnailTrainingCard;
