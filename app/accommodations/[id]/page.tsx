"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorText } from "../../../components/atoms/ErrorText";
import { MutedText } from "../../../components/atoms/MutedText";
import { ShareIcon } from "../../../components/atoms/icons";
import { PreferencesTopBar } from "../../../components/molecules/PreferencesTopBar";
import {
  type AccommodationDTO,
  ACCOMMODATION_CATEGORY_LABEL,
  accommodationApi,
} from "../../../lib/accommodations/client";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";
import { shareRestaurant } from "../../../lib/restaurants/share";

// Lazy load : Three.js chargé uniquement pour les vidéos 360°.
const Video360Player = dynamic(
  () =>
    import("../../../components/organisms/Video360Player").then(
      (m) => m.Video360Player,
    ),
  { ssr: false },
);

export default function AccommodationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { status, getAccessToken } = useAuth();
  const [accommodation, setAccommodation] = useState<AccommodationDTO | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !id) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const { accommodation: a } = await accommodationApi.getById(token, id);
        if (!cancelled) {
          setAccommodation(a);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Hébergement introuvable.");
        } else {
          setError("Impossible de charger la fiche.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, id, getAccessToken]);

  const handleShare = async () => {
    if (!accommodation) return;
    await shareRestaurant({
      id: accommodation.id,
      name: accommodation.name,
    });
  };

  if (status !== "authenticated") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <ErrorText>{error}</ErrorText>
      </main>
    );
  }

  if (!accommodation) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-stretch justify-center bg-white md:items-center md:px-4 md:py-6">
      <div className="relative w-full bg-white px-5 pt-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        <PreferencesTopBar
          title={accommodation.name}
          onBack={() => router.back()}
          rightAction={
            <button
              type="button"
              onClick={handleShare}
              aria-label="Partager"
              className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              <ShareIcon className="size-4" />
            </button>
          }
        />

        <div className="flex flex-col gap-5 pb-12">
          {accommodation.videoUrl && accommodation.video360 ? (
            <Video360Player
              src={accommodation.videoUrl}
              className="h-80 w-full rounded-3xl"
            />
          ) : accommodation.videoUrl ? (
            <video
              src={accommodation.videoUrl}
              controls
              className="h-64 w-full rounded-3xl bg-black object-cover"
            />
          ) : accommodation.mainImageUrl ? (
            <div className="overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={accommodation.mainImageUrl}
                alt={accommodation.name}
                className="h-64 w-full object-cover"
              />
            </div>
          ) : null}

          <header className="flex flex-col gap-2">
            <span className="inline-flex w-fit rounded-full bg-[#fbe4e9] px-3 py-1 text-[12px] font-semibold text-primary">
              {ACCOMMODATION_CATEGORY_LABEL[accommodation.category]}
            </span>
            <h1 className="font-serif text-3xl font-bold leading-tight text-tertiary">
              {accommodation.name}
            </h1>
            <p className="text-sm text-neutral-500">{accommodation.address}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {typeof accommodation.stars === "number" &&
                accommodation.stars > 0 && (
                  <span className="text-[13px] font-semibold text-primary">
                    {accommodation.stars}★
                  </span>
                )}
              {typeof accommodation.priceFromEur === "number" && (
                <span className="text-[13px] text-neutral-600">
                  À partir de{" "}
                  <span className="font-semibold text-tertiary">
                    {accommodation.priceFromEur} €
                  </span>{" "}
                  / nuit
                </span>
              )}
            </div>
          </header>

          <p className="whitespace-pre-line text-[14px] leading-relaxed text-neutral-700">
            {accommodation.description}
          </p>

          {accommodation.amenities.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[15px] font-semibold text-tertiary">
                Équipements
              </h2>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
