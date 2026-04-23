"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReservationShell } from "@/components/molecules/reservation/ReservationShell";
import { StepBadge } from "@/components/molecules/reservation/StepBadge";
import { RecapCard } from "@/components/molecules/reservation/RecapCard";
import { PaymentMethodOption } from "@/components/molecules/reservation/PaymentMethodOption";
import { PrimaryCTA } from "@/components/molecules/reservation/PrimaryCTA";
import {
  CreditCardIcon,
  ShieldCheckIcon,
} from "@/components/atoms/icons";
import {
  buildDefaultReservation,
  reservationStorage,
} from "@/lib/reservation/storage";
import type { PaymentMethod, ReservationState } from "@/types/reservation";

export default function ReservationStep4Page() {
  const router = useRouter();
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params?.restaurantId;

  const [reservation, setReservation] = useState<ReservationState | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("apple-pay");

  useEffect(() => {
    if (!restaurantId) return;
    const stored = reservationStorage.read(restaurantId);
    const hydrated = {
      ...buildDefaultReservation(restaurantId),
      ...stored,
    } as ReservationState;
    setReservation(hydrated);
    if (hydrated.payment?.method) setMethod(hydrated.payment.method);
  }, [restaurantId]);

  if (!restaurantId || !reservation) return null;

  const handlePay = () => {
    reservationStorage.write(restaurantId, {
      ...reservation,
      payment: { ...reservation.payment, method },
    });
    router.push(`/reservation/${restaurantId}/step-5`);
  };

  const ctaLabel =
    method === "apple-pay"
      ? `Payer ${reservation.payment.totalAmount.toLocaleString("fr-FR")} € avec Apple Pay`
      : method === "google-pay"
        ? `Payer ${reservation.payment.totalAmount.toLocaleString("fr-FR")} € avec Google Pay`
        : `Payer ${reservation.payment.totalAmount.toLocaleString("fr-FR")} € par carte`;

  return (
    <ReservationShell
      current={4}
      onBack={() => router.back()}
      onClose={() => router.push("/feed")}
      header={
        <div className="flex flex-col gap-1.5">
          <StepBadge
            icon={<ShieldCheckIcon className="size-3" />}
            label="Paiement sécurisé"
          />
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold leading-[1.12] text-tertiary">
            Votre récapitulatif
            <br />
            &amp; paiement.
          </h1>
        </div>
      }
      footer={
        <PrimaryCTA
          onClick={handlePay}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        >
          {ctaLabel}
        </PrimaryCTA>
      }
    >
      <div className="flex flex-col gap-3.5">
        <RecapCard reservation={reservation} />

        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-tertiary">Mode de paiement</h2>

          <PaymentMethodOption
            variant="apple"
            selected={method === "apple-pay"}
            onClick={() => setMethod("apple-pay")}
          >
            <span className="inline-flex items-center gap-1 font-semibold">
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden fill="white">
                <path d="M15 6.7c-.9-.1-1.6.5-2 .5s-1.1-.5-1.8-.5c-.9 0-1.8.6-2.3 1.5-1 1.7-.2 4.2.7 5.6.5.7 1 1.4 1.8 1.4s1-.4 1.9-.4 1.1.4 1.9.4 1.3-.7 1.8-1.4c.6-.8.8-1.5.8-1.6-.1 0-1.6-.6-1.6-2.4 0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.1-2.2-1.1Zm-1.5-1.2c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.6 0 1.3-.3 1.7-.8Z" />
              </svg>
              Pay
            </span>
          </PaymentMethodOption>

          <PaymentMethodOption
            variant="google"
            selected={method === "google-pay"}
            onClick={() => setMethod("google-pay")}
          >
            <span className="inline-flex items-center gap-1 text-[14px]">
              <span className="font-bold text-[#4285f4]">G</span>
              <span className="font-normal">Pay</span>
            </span>
          </PaymentMethodOption>

          <PaymentMethodOption
            variant="card"
            selected={method === "card"}
            onClick={() => setMethod("card")}
          >
            <div className="flex w-full items-center gap-3 px-4">
              <CreditCardIcon className="size-4 text-tertiary" />
              <span className="flex-1 text-left text-sm font-medium tracking-widest text-tertiary">
                •••• •••• •••• {reservation.payment.cardLast4 ?? "4242"}
              </span>
              <span className="rounded-[10px] bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary">
                Modifier
              </span>
            </div>
          </PaymentMethodOption>
        </section>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-neutral-400">
          <ShieldCheckIcon className="size-3" />
          Paiement 100% sécurisé · SSL · 3D Secure
        </div>
      </div>
    </ReservationShell>
  );
}
