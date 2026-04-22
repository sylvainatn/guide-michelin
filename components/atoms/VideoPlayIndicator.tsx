"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Quand la vidéo est en pause, on montre l'icône Play en permanence.
// Quand elle repart en lecture, on flash l'icône Pause puis on fade out
// pour ne pas parasiter le visionnage.
const FADE_MS = 600;

export const VideoPlayIndicator = ({ playing }: { playing: boolean }) => {
  const [visible, setVisible] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip le mount initial : l'autoplay via IntersectionObserver ne doit pas
    // déclencher de flash tant qu'aucune transition utilisateur n'a eu lieu.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setVisible(true);
    if (!playing) return;
    const t = setTimeout(() => setVisible(false), FADE_MS);
    return () => clearTimeout(t);
  }, [playing]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={playing ? "/icons/pause-red.svg" : "/icons/play-red.svg"}
        alt=""
        width={42}
        height={42}
        className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};
