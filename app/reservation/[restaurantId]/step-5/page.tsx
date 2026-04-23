"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConfettiBackground } from "@/components/molecules/reservation/ConfettiBackground";
import { MichelinStar } from "@/components/atoms/MichelinStar";
import {
  CelebrationStarIcon,
  HomeIcon,
  PlaneIcon,
  Share2Icon,
} from "@/components/atoms/icons";
import {
  buildDefaultReservation,
  reservationStorage,
} from "@/lib/reservation/storage";
import type { ReservationState } from "@/types/reservation";

const MONTHS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export default function ReservationStep5Page() {
  const router = useRouter();
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params?.restaurantId;

  const [reservation, setReservation] = useState<ReservationState | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    const stored = reservationStorage.read(restaurantId);
    const hydrated = {
      ...buildDefaultReservation(restaurantId),
      ...stored,
    } as ReservationState;
    setReservation(hydrated);
  }, [restaurantId]);

  if (!restaurantId || !reservation) return null;

  const checkIn = reservation.dates?.checkIn;
  const nights = reservation.dates?.nights ?? 0;

  const handleShare = async () => {
    const summary = `J'ai réservé mon escapade ${reservation.restaurantName ?? ""} !`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Mon Escapade", text: summary });
        return;
      } catch {
        // user cancelled
      }
    }
    if (typeof window !== "undefined") {
      window.alert(summary);
    }
  };

  const handleHome = () => {
    reservationStorage.clear(restaurantId);
    router.push("/feed");
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-100 py-6 md:py-10">
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[20px] bg-white shadow-[0_8px_40px_0_rgba(0,0,0,0.08)]">
        <ConfettiBackground />

        <div className="relative flex flex-col items-center px-6 pt-16">
          <div className="flex items-center gap-1 pb-7">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-11 rounded-full bg-primary"
              />
            ))}
          </div>

          <div
            className="flex size-20 items-center justify-center rounded-full shadow-[0_8px_32px_0_rgba(200,16,46,0.13)]"
            style={{
              backgroundImage:
                "linear-gradient(225deg, #fdf0f2 14%, #fff0c0 85%)",
            }}
          >
            <CelebrationStarIcon className="size-10 text-primary" />
          </div>

          <div className="flex flex-col items-center gap-2 pt-4 pb-6 text-center">
            <h1 className="font-['Playfair_Display',serif] text-[32px] font-bold leading-[1.12] text-tertiary">
              Escapade
              <br />
              confirmée !
            </h1>
            <p className="text-sm leading-[1.5] text-neutral-500">
              Votre aventure gastronomique vous attend.
              <br />
              Préparez-vous à vivre l&apos;excellence.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-3xl bg-tertiary p-6 shadow-[0_8px_32px_0_rgba(200,16,46,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  <MichelinStar count={1} className="size-4" />
                  LE GUIDE MICHELIN
                </span>
                <span className="font-['Playfair_Display',serif] text-[22px] font-bold text-white">
                  {reservation.restaurantName ?? "Escapade"}
                </span>
                {reservation.address && (
                  <span className="text-xs text-white/50">
                    {reservation.address}
                  </span>
                )}
              </div>

              <div className="flex size-[72px] items-center justify-center rounded-xl bg-white/10">
                <svg
                  viewBox="0 0 72 72"
                  className="size-10 text-white/70"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M8 60V28l28-16 28 16v32" />
                  <path d="M20 60V40h32v20" />
                  <path d="M28 60v-8h16v8" />
                </svg>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex items-center justify-between">
              <Detail
                label="ARRIVÉE"
                value={
                  checkIn
                    ? `${checkIn.getDate()} ${MONTHS_SHORT[checkIn.getMonth()]}`
                    : "—"
                }
              />
              <Detail label="NUITS" value={String(nights)} />
              <Detail
                label="PERSONNES"
                value={String(reservation.guests.adults)}
              />
              <Detail
                label="ÉTOILE"
                value={reservation.stars ? `★ ${reservation.stars}` : "—"}
                accent
              />
            </div>

            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-1.5 text-[11px] font-semibold text-white">
                <PlaneIcon className="size-3" />
                Départ imminent
                {checkIn
                  ? ` · ${checkIn.getDate()} ${MONTHS_LONG[checkIn.getMonth()]} ${checkIn.getFullYear()}`
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-2.5 px-6 pt-8 pb-12">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-[15px] font-bold text-white shadow-[0_4px_20px_0_rgba(200,16,46,0.21)]"
          >
            <Share2Icon className="size-4" />
            Partager mon Escapade
          </button>
          <button
            type="button"
            onClick={handleHome}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold text-tertiary"
          >
            <HomeIcon className="size-4" />
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </main>
  );
}

const Detail = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div className="flex flex-col items-center gap-0.5 text-center">
    <span className="text-[9px] font-medium uppercase tracking-wider text-white/40">
      {label}
    </span>
    <span
      className={`text-sm font-bold ${accent ? "text-primary" : "text-white"}`}
    >
      {value}
    </span>
  </div>
);
