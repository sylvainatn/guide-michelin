"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACCOMMODATION_CATEGORY_LABEL } from "../../lib/accommodations/client";
import type { FeedItem } from "../../lib/feed/client";
import { shareRestaurant } from "../../lib/restaurants/share";
import { MuteToggle } from "../atoms/MuteToggle";
import { MutedText } from "../atoms/MutedText";
import { Video } from "../atoms/Video";
import { VideoPlayIndicator } from "../atoms/VideoPlayIndicator";
import { VideoProgress } from "../atoms/VideoProgress";
import { FeedActionRail } from "./FeedActionRail";
import { FeedSheet } from "./FeedSheet";
import { FeedTopbar } from "./FeedTopbar";

const PhotoSphereModal = dynamic(
  () => import("../organisms/PhotoSphereModal"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <MutedText>Chargement…</MutedText>
      </div>
    ),
  },
);

const SWIPE_THRESHOLD_PX = 70;
const SWIPE_MAX_VERTICAL_DRIFT = 60;

const TABLET_HOTELS = "Tablet Hotels";

const personaFrom = (style: string[]) => {
  if (style.length === 0) return "Pour vous";
  return ["Pour vous", ...style].join(" · ");
};

const detailHref = (item: FeedItem) =>
  item.kind === "restaurant"
    ? `/restaurants/${item.id}`
    : `/accommodations/${item.id}`;

const personaOf = (item: FeedItem) => {
  if (item.kind === "restaurant") return personaFrom(item.style);
  return ["Hébergement", ACCOMMODATION_CATEGORY_LABEL[item.category]].join(
    " · ",
  );
};

const partnerTagOf = (item: FeedItem) => {
  if (item.kind === "restaurant")
    return item.stars && item.stars >= 1 ? TABLET_HOTELS : null;
  if (typeof item.priceFromEur === "number")
    return `À partir de ${item.priceFromEur} € / nuit`;
  return null;
};

const ctaLabelOf = (item: FeedItem) =>
  item.kind === "restaurant"
    ? "Réserver cette Escapade"
    : "Voir l'hébergement";

export const VideoCard = ({ item }: { item: FeedItem }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          void el.play().catch(() => {});
        } else {
          el.pause();
          el.currentTime = 0;
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  const handleShare = useCallback(() => {
    void shareRestaurant({ id: item.id, name: item.name });
  }, [item.id, item.name]);

  const href = detailHref(item);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (dx <= -SWIPE_THRESHOLD_PX && Math.abs(dy) < SWIPE_MAX_VERTICAL_DRIFT) {
      router.push(href);
    }
  };

  return (
    <article
      className="relative h-full w-full overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Video
        ref={videoRef}
        src={item.videoUrl}
        muted={muted}
        onClick={togglePlay}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-transparent" />

      <VideoPlayIndicator playing={playing} />

      <FeedTopbar persona={personaOf(item)} />
      <FeedActionRail
        bookmark={
          item.kind === "restaurant"
            ? {
                restaurantId: item.id,
                initialSaved: item.bookmarkedByMe,
                initialFavorited: item.favoritedByMe,
              }
            : undefined
        }
        onShare={handleShare}
      />

      <div className="absolute right-4 top-20 z-20">
        <MuteToggle muted={muted} onToggle={toggleMute} />
      </div>

      <FeedSheet
        href={href}
        name={item.name}
        address={item.address}
        stars={item.stars}
        partnerTag={partnerTagOf(item)}
        ctaLabel={ctaLabelOf(item)}
        onOpenTour={
          item.kind === "restaurant" && (item.photos360?.length ?? 0) > 0
            ? () => setTourOpen(true)
            : null
        }
      />

      {tourOpen && item.kind === "restaurant" && (
        <PhotoSphereModal
          photos={item.photos360}
          restaurantName={item.name}
          onClose={() => setTourOpen(false)}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 z-30">
        <VideoProgress videoRef={videoRef} />
      </div>
    </article>
  );
};
