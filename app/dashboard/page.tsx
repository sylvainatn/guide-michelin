"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/atoms/Button";
import { ErrorText } from "../../components/atoms/ErrorText";
import { MutedText } from "../../components/atoms/MutedText";
import { PageHeader } from "../../components/molecules/PageHeader";
import { RestaurantList } from "../../components/organisms/RestaurantList";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import {
  type RestaurantDTO,
  restaurantApi,
} from "../../lib/restaurants/client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
    else if (status === "authenticated" && user && user.role !== "ADMIN") {
      router.replace("/account");
    }
  }, [status, user, router]);

  useEffect(() => {
    if (status !== "authenticated" || user?.role !== "ADMIN") return;
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const { restaurants: list } = await restaurantApi.listMine(token);
        if (!cancelled) {
          setError(null);
          setRestaurants(list);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "Impossible de charger tes établissements."
            : "Erreur réseau. Réessaie.",
        );
        setRestaurants([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, user, getAccessToken]);

  if (status !== "authenticated" || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        subtitle={`Gère les fiches de tes restaurants, ${user.firstName}.`}
      />

      <div className="flex flex-col gap-3">
        <Button onClick={() => router.push("/dashboard/add-restaurant")}>
          Ajouter un restaurant
        </Button>
        <Button variant="secondary" onClick={() => router.push("/account")}>
          Mon compte
        </Button>
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <section className="space-y-3">
        <h2 className="text-h2 text-neutral-700">Mes restaurants</h2>
        <RestaurantList
          restaurants={restaurants}
          emptyLinkHref="/dashboard/add-restaurant"
        />
      </section>
    </div>
  );
}
