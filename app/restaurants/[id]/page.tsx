"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ErrorText } from "../../../components/atoms/ErrorText";
import { MutedText } from "../../../components/atoms/MutedText";
import { RestaurantHero } from "../../../components/organisms/RestaurantHero";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";
import {
  type RestaurantDetailDTO,
  restaurantApi,
} from "../../../lib/restaurants/client";
import { isTourConfig } from "../../../lib/restaurants/tour-stops";

// Lazy load : le bundle Three.js n'est telecharge qu'au moment d'ouvrir la visite.
const RestaurantTour3D = dynamic(
  () => import("../../../components/organisms/RestaurantTour3D"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-secondary">
        <MutedText>Chargement de la visite 3D...</MutedText>
      </div>
    ),
  },
);

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { status, getAccessToken } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantDetailDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);

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
    const shareData = {
      title: restaurant.name,
      text: `Decouvre ${restaurant.name} sur le Guide Michelin.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(
          shareData,
        );
        return;
      } catch {
        // User cancelled or unsupported -- fall through.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard && shareData.url) {
      await navigator.clipboard.writeText(shareData.url).catch(() => {});
    }
  }, [restaurant]);

  const handleReserve = useCallback(() => {
    // Placeholder : a brancher sur le module de resa quand dispo.
    // Pour l'instant, on ouvre un mailto vers le chef / l'adresse.
    if (!restaurant) return;
    const subject = encodeURIComponent(
      `Reservation -- ${restaurant.name}`,
    );
    window.open(`mailto:?subject=${subject}`, "_blank");
  }, [restaurant]);

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

  const tourConfig = isTourConfig(restaurant.tourStops) ? restaurant.tourStops : null;

  return (
    <main className="flex flex-1 flex-col bg-secondary">
      <RestaurantHero
        restaurant={restaurant}
        onOpenTour={() => setTourOpen(true)}
        onReserve={handleReserve}
        onShare={handleShare}
        onSave={() => {}}
        onBack={() => router.back()}
      />

      {tourOpen && (
        <RestaurantTour3D
          restaurantName={restaurant.name}
          chefName={restaurant.chefName}
          stars={restaurant.stars}
          address={restaurant.address}
          style={restaurant.style}
          priceRange={restaurant.priceRange}
          tourConfig={tourConfig}
          wallTextures={restaurant.photos360}
          onClose={() => setTourOpen(false)}
          onReserve={handleReserve}
          onShare={handleShare}
        />
      )}
    </main>
  );
}
