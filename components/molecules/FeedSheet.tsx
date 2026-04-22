"use client";

import Link from "next/link";
import { Button } from "../atoms/Button";
import { MichelinBadge } from "../atoms/MichelinBadge";
import { ArrowRightIcon, CubeIcon, PinIcon } from "../atoms/icons";

type FeedSheetProps = {
  id: string;
  name: string;
  address: string;
  stars: number | null;
  partnerTag?: string | null;
};

export const FeedSheet = ({
  id,
  name,
  address,
  stars,
  partnerTag,
}: FeedSheetProps) => (
  <section
    className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white px-5 pt-3 shadow-[0_-16px_40px_-20px_rgba(0,0,0,0.35)]"
    style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
  >
    <div
      aria-hidden
      className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-neutral-200"
    />
    <div className="flex flex-wrap items-center gap-2">
      {stars !== null && stars > 0 && <MichelinBadge stars={stars} />}
      {partnerTag && (
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700">
          {partnerTag}
        </span>
      )}
    </div>
    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-neutral-900">
      {name}
    </h2>
    <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
      <PinIcon className="size-4 text-primary" />
      {address}
    </p>
    <div
      aria-hidden
      className="mt-3 h-0.5 w-20 rounded-full bg-linear-to-r from-primary to-transparent"
    />
    <div className="mt-4 flex items-stretch gap-3">
      <Link
        href={`/restaurants/${id}?tour=1`}
        className="flex flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-primary/20 bg-white px-4 py-2.5 text-primary shadow-sm"
      >
        <CubeIcon className="size-5" />
        <span className="text-[11px] font-semibold">Vue 3D</span>
      </Link>
      <Button
        fullWidth
        className="h-14 flex-1 rounded-2xl text-sm"
        trailingIcon={<ArrowRightIcon className="size-4" />}
      >
        Réserver cette Escapade
      </Button>
    </div>
  </section>
);
