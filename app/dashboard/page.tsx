"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import { type RestaurantDTO, restaurantApi } from "../../lib/restaurants/client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const { restaurants: list } = await restaurantApi.listMine(token);
      setError(null);
      setRestaurants(list);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? "Impossible de charger tes établissements."
          : "Erreur réseau. Réessaie.",
      );
      setRestaurants([]);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (status !== "authenticated") return;
    void load();
  }, [status, load]);

  const onDelete = async (id: string, name: string) => {
    const ok = window.confirm(`Supprimer définitivement "${name}" ?`);
    if (!ok) return;
    const token = getAccessToken();
    if (!token) return;
    setDeletingId(id);
    try {
      await restaurantApi.remove(token, id);
      setRestaurants((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Suppression impossible.",
      );
    } finally {
      setDeletingId(null);
    }
  };

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
              <li
                key={r.id}
                className="flex items-start justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {r.description}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">{r.address}</p>
                  {r.videoUrl && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Vidéo : <span className="underline">{r.videoUrl}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                  <Link
                    href={`/dashboard/restaurants/${r.id}/edit`}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id, r.name)}
                    disabled={deletingId === r.id}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === r.id ? "Suppression…" : "Supprimer"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
