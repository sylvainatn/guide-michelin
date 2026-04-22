"use client";

import type { RestaurantDetailDTO } from "../../lib/restaurants/client";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { MichelinStar } from "../atoms/MichelinStar";
import { Tour3DButton } from "../atoms/Tour3DButton";

type Props = {
  restaurant: RestaurantDetailDTO;
  onOpenTour: () => void;
  onReserve: () => void;
  onShare: () => void;
  onSave?: () => void;
  onBack?: () => void;
};

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
    <path
      d="M12 22s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const RoundIconBtn = ({
  label,
  onClick,
  children,
  active = false,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition-colors ${
      active ? "bg-primary text-secondary" : "bg-secondary/90 text-tertiary hover:bg-secondary"
    }`}
  >
    {children}
  </button>
);

export const RestaurantHero = ({
  restaurant,
  onOpenTour,
  onReserve,
  onShare,
  onSave,
  onBack,
}: Props) => {
  const starsCount = restaurant.stars ?? 0;
  const tag = restaurant.style?.[0];

  return (
    <article className="relative flex flex-col bg-secondary">
      {/* Hero image / placeholder */}
      <div className="relative h-[56vh] min-h-[360px] w-full overflow-hidden bg-gradient-to-br from-michelin-red-300 via-michelin-red-500 to-tertiary">
        {/* Tag + search + avatar header */}
        <div
          className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 px-4"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {restaurant.style?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-secondary/95 px-3 py-1.5 text-h2 font-medium text-tertiary shadow-sm"
              >
                {s === restaurant.style?.[0] ? `✦ ${s}` : s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <RoundIconBtn label="Rechercher" onClick={onBack}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </RoundIconBtn>
            <RoundIconBtn label="Profil" active>
              <span className="text-h1 font-semibold">M</span>
            </RoundIconBtn>
          </div>
        </div>

        {/* Right action column */}
        <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
          <RoundIconBtn label="Sauver" onClick={onSave}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M6 3h12v18l-6-4-6 4V3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </RoundIconBtn>
          <RoundIconBtn label="Partager" onClick={onShare}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="m8 11 8-4 M8 13l8 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </RoundIconBtn>
          <RoundIconBtn label="Favori" onClick={onSave}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M12 20s-7-4.5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="#c0012c"
              />
            </svg>
          </RoundIconBtn>
        </div>

        {/* Thin progress bar a la TikTok */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full w-1/3 bg-primary" />
        </div>
      </div>

      {/* Fiche body */}
      <div className="relative -mt-4 rounded-t-3xl bg-secondary px-5 pt-5">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-neutral-200" />

        <div className="flex flex-wrap items-center gap-2">
          {starsCount > 0 && <MichelinStar count={starsCount} />}
          {tag && <Badge>{tag}</Badge>}
        </div>

        <h1
          className="mt-3 font-serif text-4xl font-bold tracking-tight text-tertiary"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {restaurant.name}
        </h1>

        <p className="mt-2 inline-flex items-center gap-1.5 text-h3 text-primary">
          <MapPinIcon />
          <span>{restaurant.address}</span>
        </p>

        {restaurant.chefName && (
          <p className="mt-1 text-h3 text-neutral-600">Chef {restaurant.chefName}</p>
        )}

        {restaurant.description && (
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            {restaurant.description}
          </p>
        )}

        {/* CTA row */}
        <div className="mt-5 flex items-stretch gap-3 pb-6">
          <Tour3DButton onClick={onOpenTour} />
          <Button onClick={onReserve} className="flex-1 text-h1">
            Reserver cette Escapade
            <span aria-hidden="true">&nbsp;&rarr;</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
