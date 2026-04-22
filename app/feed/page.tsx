"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorText } from "../../components/atoms/ErrorText";
import { MutedText } from "../../components/atoms/MutedText";
import { VideoFeed } from "../../components/organisms/VideoFeed";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import {
  type FeedRestaurantDTO,
  restaurantApi,
} from "../../lib/restaurants/client";

export default function FeedPage() {
  const router = useRouter();
  const { status, getAccessToken } = useAuth();
  const [items, setItems] = useState<FeedRestaurantDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const { restaurants } = await restaurantApi.feed(token);
        if (!cancelled) {
          setError(null);
          setItems(restaurants);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "Impossible de charger le feed."
            : "Erreur réseau. Réessaie.",
        );
        setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, getAccessToken]);

  if (status !== "authenticated") {
    return (
      <div className="flex flex-1 items-center justify-center bg-black text-white">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  return (
    <main
      className="relative flex flex-1 items-center justify-center bg-black"
      style={{ height: "100dvh" }}
    >
      {/* Mobile: full-bleed. Desktop: phone-shaped frame centré. */}
      <div
        className="relative h-full w-full overflow-hidden bg-black md:my-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-white/10"
      >
        {error && (
          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-md bg-white/95 px-4 py-2 shadow">
            <ErrorText>{error}</ErrorText>
          </div>
        )}
        {items === null ? (
          <div className="flex h-full items-center justify-center text-white">
            <MutedText>Chargement…</MutedText>
          </div>
        ) : (
          <VideoFeed items={items} />
        )}
      </div>
    </main>
  );
}
