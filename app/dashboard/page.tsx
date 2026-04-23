"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ErrorText } from "../../components/atoms/ErrorText";
import { MutedText } from "../../components/atoms/MutedText";
import {
  BuildingIcon,
  CutleryCrossedIcon,
  PlusIcon,
  StarFilledIcon,
} from "../../components/atoms/icons";
import { DashboardStatCard } from "../../components/molecules/DashboardStatCard";
import { RestaurantList } from "../../components/organisms/RestaurantList";
import {
  type AccommodationDTO,
  accommodationApi,
} from "../../lib/accommodations/client";
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
  const [accommodations, setAccommodations] = useState<
    AccommodationDTO[] | null
  >(null);
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
        const [rest, acc] = await Promise.all([
          restaurantApi.listMine(token),
          accommodationApi.listMine(token),
        ]);
        if (!cancelled) {
          setError(null);
          setRestaurants(rest.restaurants);
          setAccommodations(acc.accommodations);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "Impossible de charger tes établissements."
            : "Erreur réseau. Réessaie.",
        );
        setRestaurants([]);
        setAccommodations([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, user, getAccessToken]);

  const stats = useMemo(() => {
    const total = restaurants?.length ?? 0;
    const starred =
      restaurants?.filter((r) => (r.stars ?? 0) >= 1).length ?? 0;
    const accommodationsTotal = accommodations?.length ?? 0;
    return { total, starred, accommodationsTotal };
  }, [restaurants, accommodations]);

  if (status !== "authenticated" || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
            Tableau de bord
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-tertiary md:text-4xl">
            Bonjour, {user.firstName}.
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gère les fiches de tes établissements et suis leur activité.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/add-restaurant")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow hover:bg-michelin-red-500"
        >
          <PlusIcon className="size-4" />
          Ajouter un restaurant
        </button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardStatCard
          label="Restaurants"
          value={stats.total}
          icon={<CutleryCrossedIcon className="size-5" />}
          hint="Total enregistrés"
        />
        <DashboardStatCard
          label="Étoilés"
          value={stats.starred}
          icon={<StarFilledIcon className="size-5" />}
          hint="Au moins 1 étoile"
        />
        <DashboardStatCard
          label="Hébergements"
          value={stats.accommodationsTotal}
          icon={<BuildingIcon className="size-5" />}
          hint="Hôtels, chalets, villas…"
        />
      </section>

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
