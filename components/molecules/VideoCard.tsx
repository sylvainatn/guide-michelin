"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FeedRestaurantDTO } from "../../lib/restaurants/client";
import { MuteToggle } from "../atoms/MuteToggle";
import { Tour3DButton } from "../atoms/Tour3DButton";
import { Video } from "../atoms/Video";
import { VideoProgress } from "../atoms/VideoProgress";

export const VideoCard = ({ item }: { item: FeedRestaurantDTO }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  // Play only when the card is visible (TikTok-like behavior).
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

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      <div
        className="absolute right-4 top-4 z-10 flex flex-col items-end gap-3"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <MuteToggle muted={muted} onToggle={toggleMute} />
        <Link href={`/restaurants/${item.id}`} className="pointer-events-auto">
          <Tour3DButton className="bg-white/90 text-tertiary backdrop-blur" />
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Link
          href={`/restaurants/${item.id}`}
          className="block space-y-1.5 px-5 pb-4 pt-6 text-white"
        >
          <h2 className="text-h4 drop-shadow-md">{item.name}</h2>
          <p className="line-clamp-3 text-sm opacity-90 drop-shadow-md">
            {item.description}
          </p>
          <p className="text-h2 opacity-80 drop-shadow-md">{item.address}</p>
        </Link>
        <VideoProgress videoRef={videoRef} />
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </article>
  );
};
