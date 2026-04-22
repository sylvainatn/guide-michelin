"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Quand la vidéo est en pause, on montre l'icône Play en permanence.
// Quand elle repart en lecture, on flash l'icône Pause puis on fade out
// pour ne pas parasiter le visionnage.
const FADE_MS = 600;

export const VideoPlayIndicator = ({ playing }: { playing: boolean }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!playing) {
      setVisible(true);
      return;
    }
    setVisible(true);
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
        width={72}
        height={72}
        className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};
