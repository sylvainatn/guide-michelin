"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { type RestaurantDTO, restaurantApi } from "../../lib/restaurants/client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantDTO[] | null>(null);
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
  }, [status, getAccessToken]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-neutral-500">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-sm text-neutral-500">
          Gère les fiches de tes restaurants, {user.firstName}.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/add-restaurant"
          className="inline-flex rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Ajouter un restaurant
        </Link>
        <Link
          href="/account"
          className="inline-flex rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"
        >
          Mon compte
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-700">Mes restaurants</h2>
        {restaurants === null ? (
          <p className="text-sm text-neutral-500">Chargement…</p>
        ) : restaurants.length === 0 ? (
          <p className="rounded-md border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            Tu n’as pas encore enregistré de restaurant.{" "}
            <Link href="/dashboard/add-restaurant" className="text-black underline">
              Ajouter le premier
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
            {restaurants.map((r) => (
              <li key={r.id} className="px-4 py-3">
                <p className="font-medium">{r.name}</p>
                <p className="text-sm text-neutral-500 line-clamp-2">{r.description}</p>
                <p className="mt-1 text-xs text-neutral-400">{r.address}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
