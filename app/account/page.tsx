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
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <PageHeader
          title="Mon compte"
          subtitle={`Bienvenue ${user.firstName} ${user.lastName}.`}
        />
        <AccountDetails user={user} />
        <Button
          variant="secondary"
          onClick={() => {
            void logout().then(() => router.replace("/signin"));
          }}
        >
          Se déconnecter
        </Button>
      </div>
    </main>
  );
}
