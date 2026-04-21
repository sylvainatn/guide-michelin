"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export const VideoProgress = ({ videoRef }: Props) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  draggingRef.current = dragging;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    let raf = 0;

    const tick = () => {
      if (!draggingRef.current) {
        const d = el.duration || 0;
        setProgress(d > 0 ? el.currentTime / d : 0);
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    el.addEventListener("play", start);
    el.addEventListener("pause", stop);
    el.addEventListener("ended", stop);
    if (!el.paused) start();

    return () => {
      stop();
      el.removeEventListener("play", start);
      el.removeEventListener("pause", stop);
      el.removeEventListener("ended", stop);
    };
  }, [videoRef]);

  const seekFromClientX = (clientX: number) => {
    const track = trackRef.current;
    const el = videoRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgress(ratio);
    if (el.duration) el.currentTime = ratio * el.duration;
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => seekFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label="Progression de la vidéo"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        seekFromClientX(e.clientX);
      }}
      className={`relative w-full cursor-pointer touch-none transition-[height] duration-150 ${
        dragging ? "h-1.5" : "h-0.75"
      }`}
    >
      <div className="absolute inset-0 bg-white/25" />
      <div
        className="absolute inset-y-0 left-0 bg-white"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};
