"use client";

import Link from "next/link";
import { MichelinBadge } from "../atoms/MichelinBadge";
import { OutlinedPill } from "../atoms/OutlinedPill";
import { ArrowRightIcon, PanoramaIcon, PinIcon } from "../atoms/icons";

type FeedSheetProps = {
  href: string;
  name: string;
  address: string;
  stars: number | null;
  partnerTag?: string | null;
  ctaLabel?: string;
  onOpenTour?: (() => void) | null;
};

export const FeedSheet = ({
  href,
  name,
  address,
  stars,
  partnerTag,
  ctaLabel = "Réserver cette Escapade",
  onOpenTour,
}: FeedSheetProps) => (
  <section
    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 via-black/45 to-transparent px-5 pt-20 text-white"
    style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
  >
    <div className="pointer-events-auto flex flex-wrap items-center gap-2">
      {stars !== null && stars > 0 && <MichelinBadge stars={stars} />}
      {partnerTag && <OutlinedPill>{partnerTag}</OutlinedPill>}
    </div>

    <Link href={href} className="pointer-events-auto">
      <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-sm">
        {name}
      </h2>
    </Link>

    <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white/95">
      <PinIcon className="size-4 text-primary" />
      {address}
    </p>

    <div className="pointer-events-auto mt-4 flex items-stretch gap-3">
      {onOpenTour && (
        <button
          type="button"
          onClick={onOpenTour}
          className="flex w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-white py-2.5 text-neutral-900 shadow-lg"
        >
          <PanoramaIcon className="size-5" />
          <span className="text-[10px] font-semibold">Vue 360°</span>
        </button>
      )}
      <Link
        href={href}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-h1 font-semibold text-white transition-colors hover:bg-michelin-red-500 active:bg-michelin-red-700"
      >
        {ctaLabel}
        <ArrowRightIcon className="size-4 shrink-0" />
      </Link>
    </div>
  </section>
);
