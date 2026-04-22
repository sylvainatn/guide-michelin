"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedRestaurantDTO } from "../../lib/restaurants/client";
import { MuteToggle } from "../atoms/MuteToggle";
import { Video } from "../atoms/Video";
import { VideoPlayIndicator } from "../atoms/VideoPlayIndicator";
import { VideoProgress } from "../atoms/VideoProgress";
import { FeedActionRail } from "./FeedActionRail";
import { FeedSheet } from "./FeedSheet";
import { FeedTopbar } from "./FeedTopbar";

const TABLET_HOTELS = "Tablet Hotels";

const personaFrom = (style: string[]) => {
  if (style.length === 0) return "Pour vous";
  return ["Pour vous", ...style].join(" · ");
};

export const VideoCard = ({ item }: { item: FeedRestaurantDTO }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

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

  return (
    <article className="relative h-full w-full overflow-hidden bg-black">
      <Video
        ref={videoRef}
        src={item.videoUrl}
        muted={muted}
        onClick={togglePlay}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-transparent" />

      <VideoPlayIndicator playing={playing} />

      <FeedTopbar persona={personaFrom(item.style)} />
      <FeedActionRail />

      <div className="absolute right-4 top-20 z-20">
        <MuteToggle muted={muted} onToggle={toggleMute} />
      </div>

      <FeedSheet
        id={item.id}
        name={item.name}
        address={item.address}
        stars={item.stars}
        partnerTag={item.stars && item.stars >= 1 ? TABLET_HOTELS : null}
      />

      <div className="absolute inset-x-0 bottom-0 z-30">
        <VideoProgress videoRef={videoRef} />
      </div>
    </article>
  );
};
