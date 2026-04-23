"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorText } from "../../../components/atoms/ErrorText";
import { MutedText } from "../../../components/atoms/MutedText";
import { PlusIcon } from "../../../components/atoms/icons";
import { AccommodationList } from "../../../components/organisms/AccommodationList";
import {
  type AccommodationDTO,
  accommodationApi,
} from "../../../lib/accommodations/client";
import { ApiError } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";

export default function AccommodationsPage() {
  const router = useRouter();
  const { user, status, getAccessToken } = useAuth();
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
        const { accommodations: list } = await accommodationApi.listMine(token);
        if (!cancelled) {
          setError(null);
          setAccommodations(list);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "Impossible de charger tes hébergements."
            : "Erreur réseau. Réessaie.",
        );
        setAccommodations([]);
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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
            Hébergements
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-tertiary md:text-4xl">
            Mes hébergements.
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gère les hôtels, chambres d&apos;hôtes et autres hébergements que tu
            proposes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/add-accommodation")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow hover:bg-michelin-red-500"
        >
          <PlusIcon className="size-4" />
          Ajouter un hébergement
        </button>
      </header>

      {error && <ErrorText>{error}</ErrorText>}

      <AccommodationList
        accommodations={accommodations}
        emptyLinkHref="/dashboard/add-accommodation"
      />
    </div>
  );
}
