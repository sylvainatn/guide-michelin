"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_TOUR_CONFIG,
  type Ambience,
  type TourConfig,
} from "../../../lib/restaurants/tour-stops";
import { Button } from "../../atoms/Button";
import { MichelinStar } from "../../atoms/MichelinStar";
import { createTourEngine, isWebGLAvailable, type EngineHandle } from "./engine";

export type RestaurantTour3DProps = {
  restaurantName: string;
  chefName?: string | null;
  stars?: number | null;
  address: string;
  style?: string[];
  priceRange?: string | null;
  tourConfig?: TourConfig | null;
  wallTextures?: string[];
  onClose: () => void;
  onReserve: () => void;
  onShare: () => void;
};

const AMBIENCE_LABEL: Record<Ambience, string> = {
  dawn: "Aube",
  midi: "Midi",
  soir: "Soir",
};

export const RestaurantTour3D = ({
  restaurantName,
  chefName,
  stars,
  address,
  style,
  priceRange,
  tourConfig,
  wallTextures,
  onClose,
  onReserve,
  onShare,
}: RestaurantTour3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  // Lazy init : la detection WebGL tourne une seule fois, pas besoin d'un useEffect.
  const [webglSupported, setWebglSupported] = useState(() =>
    typeof window === "undefined" ? true : isWebGLAvailable(),
  );
  const [ambience, setAmbience] = useState<Ambience>(
    tourConfig?.ambient ?? DEFAULT_TOUR_CONFIG.ambient,
  );
  const [currentStop, setCurrentStop] = useState(0);
  const [guidedPlaying, setGuidedPlaying] = useState(false);

  const effectiveTour = useMemo<TourConfig>(
    () => tourConfig ?? DEFAULT_TOUR_CONFIG,
    [tourConfig],
  );

  useEffect(() => {
    if (!webglSupported) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: EngineHandle | null = null;
    try {
      engine = createTourEngine({
        canvas,
        tour: effectiveTour,
        wallTextures,
        initialAmbience: ambience,
      });
    } catch (err) {
      console.error("RestaurantTour3D: engine init failed", err);
      // Defere le setState hors du corps de l'effet : tombe sur le fallback
      // "WebGL indisponible" proprement sans cascade de renders.
      queueMicrotask(() => setWebglSupported(false));
      return;
    }
    engineRef.current = engine;

    const unsub = engine.onStopChange((i) => setCurrentStop(i));

    return () => {
      unsub();
      engine?.dispose();
      engineRef.current = null;
    };
    // Remount si on change de tour ou de textures -- assume rarement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTour, wallTextures, webglSupported]);

  const changeAmbience = useCallback((next: Ambience) => {
    setAmbience(next);
    engineRef.current?.setAmbience(next);
  }, []);

  const toggleGuided = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (guidedPlaying) {
      engine.stopGuidedTour();
      setGuidedPlaying(false);
    } else {
      engine.startGuidedTour();
      setGuidedPlaying(true);
    }
  }, [guidedPlaying]);

  const jumpToStop = useCallback((index: number) => {
    engineRef.current?.goToStop(index);
    setCurrentStop(index);
    setGuidedPlaying(true);
  }, []);

  // Esc pour fermer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const starsCount = stars ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black text-secondary"
      role="dialog"
      aria-modal="true"
      aria-label={`Visite 3D -- ${restaurantName}`}
    >
      {/* --------- Scene --------- */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          style={{ cursor: "grab" }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-tertiary px-6 text-center">
          <p className="text-h4">
            La visite 3D n&apos;est pas disponible sur cet appareil (WebGL requis).
          </p>
        </div>
      )}

      {/* --------- Gradient top + bottom --------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/90 to-transparent" />

      {/* --------- Header : infos restaurant --------- */}
      <header
        className="pointer-events-none relative z-10 flex items-start justify-between gap-3 px-5 pt-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {starsCount > 0 && <MichelinStar count={starsCount} />}
          {style?.map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-h2 font-medium backdrop-blur"
            >
              {s}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la visite"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 backdrop-blur hover:bg-secondary/25"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M6 6 L18 18 M18 6 L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* --------- Colonne actions droite (share) --------- */}
      <div className="pointer-events-none absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        <button
          type="button"
          onClick={onShare}
          aria-label="Partager"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15 backdrop-blur hover:bg-secondary/25"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
            <path
              d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7 M12 3v12 M8 7l4-4 4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* --------- Panel inferieur --------- */}
      <section
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-5 pb-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
      >
        {/* Titre + meta */}
        <div className="pointer-events-auto space-y-1.5">
          <h2 className="text-2xl font-semibold drop-shadow-md">
            {restaurantName}
          </h2>
          <p className="text-h3 opacity-90 drop-shadow-md">
            {chefName ? `Chef ${chefName} -- ` : ""}
            {address}
            {priceRange ? ` -- ${priceRange.replaceAll("EUR", "\u20AC")}` : ""}
          </p>
        </div>

        {/* Switch ambiance */}
        <div className="pointer-events-auto flex w-fit items-center gap-1 rounded-full bg-secondary/10 p-1 backdrop-blur">
          {(Object.keys(AMBIENCE_LABEL) as Ambience[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => changeAmbience(a)}
              className={`rounded-full px-3 py-1.5 text-h2 transition-colors ${
                ambience === a
                  ? "bg-primary text-secondary"
                  : "text-secondary/80 hover:text-secondary"
              }`}
            >
              {AMBIENCE_LABEL[a]}
            </button>
          ))}
        </div>

        {/* Stops + guided toggle */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {effectiveTour.stops.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToStop(i)}
              className={`rounded-full border px-3 py-1.5 text-h2 transition-colors ${
                currentStop === i
                  ? "border-primary bg-primary text-secondary"
                  : "border-secondary/30 text-secondary/85 hover:border-secondary/60"
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleGuided}
            className="rounded-full border border-secondary/30 px-3 py-1.5 text-h2 text-secondary/85 hover:border-secondary/60"
          >
            {guidedPlaying ? "Pause" : "Visite guidee"}
          </button>
        </div>

        {/* CTAs */}
        <div className="pointer-events-auto flex gap-3">
          <Button onClick={onReserve} className="flex-1">
            Reserver cette Escapade
          </Button>
          <Button
            variant="soft"
            onClick={onShare}
            className="bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20"
          >
            Partager
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RestaurantTour3D;
