"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MutedText } from "../../../components/atoms/MutedText";
import { PreferencesForm } from "../../../components/organisms/PreferencesForm";
import { ApiError, profileApi, type UserProfile } from "../../../lib/auth/client";
import { useAuth } from "../../../lib/auth/context";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; profile: UserProfile | null }
  | { kind: "error"; message: string };

export default function PreferencesPage() {
  const router = useRouter();
  const { status, getAccessToken } = useAuth();
  const [load, setLoad] = useState<LoadState>({ kind: "loading" });

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
        const { profile } = await profileApi.get(token);
        if (!cancelled) setLoad({ kind: "ready", profile });
      } catch (err) {
        if (cancelled) return;
        setLoad({
          kind: "error",
          message:
            err instanceof ApiError
              ? "Impossible de charger votre profil."
              : "Erreur réseau. Réessaie.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, getAccessToken]);

  if (status !== "authenticated" || load.kind === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  if (load.kind === "error") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <MutedText>{load.message}</MutedText>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-stretch justify-center bg-white md:items-center md:px-4 md:py-6">
      <div className="relative w-full bg-white px-5 pt-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        <PreferencesForm initialProfile={load.profile} />
      </div>
    </main>
  );
}
