"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MutedText } from "../../../components/atoms/MutedText";
import { PaymentsDashboard } from "../../../components/organisms/PaymentsDashboard";
import { useAuth } from "../../../lib/auth/context";

export default function PaymentsPage() {
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
    <main className="flex flex-1 items-stretch justify-center bg-white md:items-center md:px-4 md:py-6">
      <div className="relative w-full bg-white px-5 pt-6 md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        <PaymentsDashboard />
      </div>
    </main>
  );
}
