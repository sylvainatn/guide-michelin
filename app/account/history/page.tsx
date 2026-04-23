"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MutedText } from "../../../components/atoms/MutedText";
import { HistoryDashboard } from "../../../components/organisms/HistoryDashboard";
import { useAuth } from "../../../lib/auth/context";

export default function HistoryPage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <MutedText>Chargement…</MutedText>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-100 md:items-center md:px-4 md:py-6">
      <div className="w-full md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(390px,100%)]">
        <HistoryDashboard />
      </div>
    </main>
  );
}
