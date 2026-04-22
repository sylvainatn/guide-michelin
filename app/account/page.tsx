"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MutedText } from "../../components/atoms/MutedText";
import { AccountDashboard } from "../../components/organisms/AccountDashboard";
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

  const handleLogout = () => {
    void logout().then(() => router.replace("/signin"));
  };

  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-100 md:items-center md:px-4 md:py-6">
      <div className="w-full overflow-y-auto bg-neutral-100 px-4 py-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:rounded-3xl md:px-5 md:shadow-2xl md:ring-1 md:ring-black/10">
        <AccountDashboard
          user={user}
          escapades={4}
          age={27}
          city="Paris"
          tribeCount={3}
          onLogout={handleLogout}
        />
      </div>
    </main>
  );
}
