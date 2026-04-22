"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedRestaurantDTO } from "../../lib/restaurants/client";
import { MuteToggle } from "../atoms/MuteToggle";
import { Video } from "../atoms/Video";
import { VideoProgress } from "../atoms/VideoProgress";
import { FeedActionRail } from "./FeedActionRail";
import { FeedSheet } from "./FeedSheet";
import { FeedTopbar } from "./FeedTopbar";

const TABLET_HOTELS = "Tablet Hotels";

const personaFrom = (style: string[]) => {
  if (style.length === 0) return "Pour vous";
  return style.join(" · ");
};

export const VideoCard = ({ item }: { item: FeedRestaurantDTO }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

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

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <article className="relative h-full w-full overflow-hidden bg-black">
      <Video
        ref={videoRef}
        src={item.videoUrl}
        muted={muted}
        onClick={toggleMute}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-transparent" />

      <FeedTopbar persona={personaFrom(item.style)} />
      <FeedActionRail />

      <div className="absolute bottom-44 right-4 z-10">
        <MuteToggle muted={muted} onToggle={toggleMute} />
      </div>

      <FeedSheet
        id={item.id}
        name={item.name}
        address={item.address}
        stars={item.stars}
        partnerTag={item.stars && item.stars >= 1 ? TABLET_HOTELS : null}
      />

      <div className="pointer-events-none absolute bottom-44 left-0 right-0 z-10">
        <VideoProgress videoRef={videoRef} />
      </div>
    </article>
  );
};
