"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ErrorText } from "../../../components/atoms/ErrorText";
import { MutedText } from "../../../components/atoms/MutedText";
import { ShareIcon } from "../../../components/atoms/icons";
import { PreferencesTopBar } from "../../../components/molecules/PreferencesTopBar";
import { RestaurantDetailHero } from "../../../components/molecules/RestaurantDetailHero";
import { MichelinReviewSection } from "../../../components/organisms/MichelinReviewSection";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";
import {
  type RestaurantDetailDTO,
  restaurantApi,
} from "../../../lib/restaurants/client";
import { shareRestaurant } from "../../../lib/restaurants/share";

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { status, getAccessToken } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantDetailDTO | null>(null);
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
        const { restaurant: r } = await restaurantApi.getById(token, id);
        if (!cancelled) {
          setError(null);
          setRestaurant(r);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Restaurant introuvable.");
        } else {
          setError("Impossible de charger la fiche.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, id, getAccessToken]);

  const handleShare = useCallback(async () => {
    if (!restaurant) return;
    await shareRestaurant({ id: restaurant.id, name: restaurant.name });
  }, [restaurant]);

  const handleReserve = useCallback(() => {
    if (!restaurant) return;
    // Redirection vers le système de réservation
    router.push(`/reservation/${restaurant.id}`);
  }, [restaurant, router]);

  if (status !== "authenticated") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement...</MutedText>
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

  if (!restaurant) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement...</MutedText>
      </main>
    );
  }

  const review = restaurant.review;

  return (
    <main className="flex flex-1 items-stretch justify-center bg-white md:items-center md:px-4 md:py-6">
      <div className="relative w-full bg-white px-5 pt-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        <PreferencesTopBar
          title={restaurant.name}
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

        <div className="flex flex-col gap-6 pb-24">
          <RestaurantDetailHero
            name={restaurant.name}
            mediaUrl={restaurant.mainImageUrl ?? restaurant.videoUrl}
            photos360={restaurant.photos360}
            stars={restaurant.stars}
            priceFromEur={review?.priceFromEur ?? null}
            tripDuration={review?.tripDuration ?? null}
            partnerBadge={review?.partnerBadge ?? null}
            locationLabel={review?.locationLabel ?? null}
            fallbackLocation={restaurant.address}
          />

          {review ? (
            <MichelinReviewSection review={review} />
          ) : (
            <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500">
              Aucune critique Michelin n&apos;est encore disponible.
            </p>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleReserve}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-white hover:bg-michelin-red-500"
            >
              Réserver cette escapade →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
