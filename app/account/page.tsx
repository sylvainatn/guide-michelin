"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MutedText } from "../../components/atoms/MutedText";
import { AccountDashboard } from "../../components/organisms/AccountDashboard";
import { useAuth } from "../../lib/auth/context";
import { profileApi, type UserProfile } from "../../lib/auth/client";
import { reservationApi } from "../../lib/reservation/client";
import { friendsApi } from "../../lib/friends/client";

export default function AccountPage() {
  const router = useRouter();
  const { user, status, logout, getAccessToken } = useAuth();
  const [escapades, setEscapades] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tribeCount, setTribeCount] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const token = getAccessToken();
    if (!token) return;

    let cancelled = false;
    reservationApi
      .list(token)
      .then((res) => {
        if (cancelled) return;
        setEscapades(
          res.reservations.filter((r) => r.status !== "CANCELLED").length,
        );
      })
      .catch(console.error);

    profileApi
      .get(token)
      .then((res) => {
        if (!cancelled) setProfile(res.profile);
      })
      .catch(console.error);

    friendsApi
      .list(token)
      .then((res) => {
        if (!cancelled) setTribeCount(res.friends.length);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [status, getAccessToken]);

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
          escapades={escapades}
          age={profile?.age ?? null}
          tribeCount={tribeCount}
          onLogout={handleLogout}
        />
      </div>
    </main>
  );
}
