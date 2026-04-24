"use client";

import { Viewer as PSViewer } from "@photo-sphere-viewer/core";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ROOM_LABELS = ["Entrée", "Salle principale", "Cuisine", "Terrasse"];

type Props = {
  photos: string[];
  restaurantName: string;
  onClose: () => void;
};

export default function PhotoSphereModal({ photos, restaurantName, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof PSViewer> | null>(null);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let rafId: number;
    let viewer: InstanceType<typeof PSViewer> | null = null;

    rafId = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el || !photos[0]) return;

      viewer = new PSViewer({
        container: el,
        panorama: photos[0],
        navbar: false,
        loadingTxt: "Chargement…",
        defaultZoomLvl: 0,
      });
      viewerRef.current = viewer;
    });

    return () => {
      cancelAnimationFrame(rafId);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [photos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const goTo = async (index: number) => {
    if (!viewerRef.current || transitioning || index === current) return;
    setTransitioning(true);
    await viewerRef.current.setPanorama(photos[index], { transition: { speed: 1200 } });
    setCurrent(index);
    setTransitioning(false);
  };

  const label = (i: number) => ROOM_LABELS[i] ?? `Vue ${i + 1}`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      {/* PSV canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/70 to-transparent">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Vue 360°
          </p>
          <h2 className="text-base font-semibold text-white">{restaurantName}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Navigation panoramas */}
      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 px-4 py-5 bg-gradient-to-t from-black/70 to-transparent">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              disabled={transitioning}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                i === current
                  ? "bg-primary text-white scale-105"
                  : "bg-white/15 text-white/80 hover:bg-white/25 backdrop-blur"
              }`}
            >
              {label(i)}
            </button>
          ))}
        </div>
      )}

      {/* Hint drag */}
      <p className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/60 backdrop-blur pointer-events-none">
        Fais glisser pour explorer
      </p>
    </div>,
    document.body,
  );
}
