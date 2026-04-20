"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
        <p className="text-sm text-neutral-500">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Mon compte</h1>
          <p className="text-sm text-neutral-500">Bienvenue {user.name ?? user.email}.</p>
        </header>

        <dl className="space-y-3 rounded-md border border-neutral-200 p-4 text-sm">
          <Row label="Email" value={user.email} />
          <Row label="Nom" value={user.name ?? "—"} />
          <Row
            label="Email vérifié"
            value={user.emailVerified ? "Oui" : "Non"}
          />
          <Row
            label="Inscrit le"
            value={new Date(user.createdAt).toLocaleDateString("fr-FR")}
          />
        </dl>

        <button
          onClick={() => {
            void logout().then(() => router.replace("/signin"));
          }}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-neutral-500">{label}</dt>
    <dd className="font-medium">{value}</dd>
  </div>
);
