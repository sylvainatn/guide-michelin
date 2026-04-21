"use client";

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
    <main className="flex flex-1 items-stretch justify-center bg-neutral-50 md:items-center md:px-4 md:py-6">
      <div className="w-full space-y-6 px-4 py-10 md:h-[calc(100dvh-3rem)] md:max-h-[900px] md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:bg-white md:p-8 md:shadow-2xl md:ring-1 md:ring-black/10">
        <PageHeader
          title="Mon compte"
          subtitle={`Bienvenue ${user.firstName} ${user.lastName}.`}
        />
        <AccountDetails user={user} />
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push("/feed")}>Voir le feed</Button>
          {user.role === "ADMIN" && (
            <Button variant="soft" onClick={() => router.push("/dashboard")}>
              Tableau de bord
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              void logout().then(() => router.replace("/signin"));
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </main>
  );
}
