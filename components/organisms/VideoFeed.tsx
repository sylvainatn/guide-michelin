import type { FeedItem } from "../../lib/feed/client";
import { MutedText } from "../atoms/MutedText";
import { VideoCard } from "../molecules/VideoCard";

export const VideoFeed = ({ items }: { items: FeedItem[] }) => {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <MutedText>Aucune vidéo pour le moment.</MutedText>
      </div>
    );
  }

  return (
    <div
      className="feed-scroll h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((item) => (
        <section
          key={`${item.kind}-${item.id}`}
          className="relative h-full w-full snap-start snap-always"
        >
          <VideoCard item={item} />
        </section>
      ))}
    </div>
  );
};
