"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../components/atoms/Button";
import { MutedText } from "../../components/atoms/MutedText";
import { PageHeader } from "../../components/molecules/PageHeader";
import { AccountDetails } from "../../components/organisms/AccountDetails";
import { useAuth } from "../../lib/auth/context";

export default function AccountPage() {
  const router = useRouter();
  const { user, status, logout } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  if (status !== "authenticated" || !user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Mon compte</h1>
          <p className="text-sm text-neutral-500">Bienvenue {user.firstName} {user.lastName}.</p>
        </header>

        <dl className="space-y-3 rounded-md border border-neutral-200 p-4 text-sm">
          <Row label="Email" value={user.email} />
          <Row label="Prénom" value={user.firstName} />
          <Row label="Nom" value={user.lastName} />
          <Row
            label="Email vérifié"
            value={user.emailVerified ? "Oui" : "Non"}
          />
          <Row
            label="Inscrit le"
            value={new Date(user.createdAt).toLocaleDateString("fr-FR")}
          />
        </dl>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Tableau de bord
          </Link>
          <button
            type="button"
            onClick={() => {
              void logout().then(() => router.replace("/signin"));
            }}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}
