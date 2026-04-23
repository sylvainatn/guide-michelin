"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReservationShell } from "@/components/molecules/reservation/ReservationShell";
import { StepBadge } from "@/components/molecules/reservation/StepBadge";
import { EventTypeCard } from "@/components/molecules/reservation/EventTypeCard";
import { PrimaryCTA } from "@/components/molecules/reservation/PrimaryCTA";
import {
  CakeIcon,
  HeartFilledIcon,
  HeartIcon,
  SparklesIcon,
  StarFilledIcon,
} from "@/components/atoms/icons";
import {
  buildDefaultReservation,
  reservationStorage,
} from "@/lib/reservation/storage";
import type { EventType } from "@/types/reservation";

const MAX_CUSTOM_CHARS = 200;

const EVENT_TYPES: Array<{ id: EventType; label: string; icon: React.ReactNode }> = [
  { id: "mariage", label: "Mariage", icon: <HeartFilledIcon className="size-5" /> },
  { id: "evjf", label: "EVJF / EVG", icon: <SparklesIcon className="size-5" /> },
  { id: "anniversaire", label: "Anniversaire", icon: <CakeIcon className="size-5" /> },
  { id: "saint-valentin", label: "Saint-Valentin", icon: <StarFilledIcon className="size-5" /> },
];

export default function ReservationStep2Page() {
  const router = useRouter();
  const params = useParams<{ restaurantId: string }>();
  const restaurantId = params?.restaurantId;

  const [eventType, setEventType] = useState<EventType>(null);
  const [customRequest, setCustomRequest] = useState("");

  useEffect(() => {
    if (!restaurantId) return;
    const stored = reservationStorage.read(restaurantId);
    if (stored?.personalization) {
      setEventType(stored.personalization.type ?? null);
      setCustomRequest(stored.personalization.customRequest ?? "");
    }
  }, [restaurantId]);

  if (!restaurantId) return null;

  const handleContinue = () => {
    const base =
      reservationStorage.read(restaurantId) ?? buildDefaultReservation(restaurantId);
    reservationStorage.write(restaurantId, {
      ...base,
      personalization: { type: eventType, customRequest },
    });
    router.push(`/reservation/${restaurantId}/step-3`);
  };

  const handleBack = () => router.back();
  const handleClose = () => router.push("/feed");

  return (
    <ReservationShell
      current={2}
      onBack={handleBack}
      onClose={handleClose}
      header={
        <div className="flex flex-col gap-1.5">
          <StepBadge
            icon={<HeartIcon className="size-3" />}
            label="Personnalisation du séjour"
          />
          <h1 className="font-['Playfair_Display',serif] text-[26px] font-bold leading-[1.12] text-tertiary">
            L&apos;occasion de
            <br />
            cette escapade ?
          </h1>
          <p className="text-[13px] leading-[1.5] text-neutral-500">
            L&apos;établissement sera informé pour rendre votre accueil unique.
          </p>
        </div>
      }
      footer={
        <PrimaryCTA onClick={handleContinue}>Continuer</PrimaryCTA>
      }
    >
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-tertiary">
            Type d&apos;événement
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {EVENT_TYPES.map((evt) => (
              <EventTypeCard
                key={evt.id ?? "none"}
                label={evt.label}
                icon={evt.icon}
                selected={eventType === evt.id}
                onClick={() =>
                  setEventType((current) => (current === evt.id ? null : evt.id))
                }
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-tertiary">Demande sur-mesure</h2>
          <div className="rounded-[14px] border border-neutral-200 bg-neutral-50 p-3.5">
            <textarea
              value={customRequest}
              maxLength={MAX_CUSTOM_CHARS}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Décrivez votre moment idéal… (ex: demande en mariage, table fleurie, champagne à l'arrivée)"
              className="h-16 w-full resize-none bg-transparent text-[13px] leading-[1.5] text-tertiary placeholder:text-neutral-400 focus:outline-none"
            />
            <div className="flex justify-end pt-2">
              <span className="text-[11px] text-neutral-400">
                {customRequest.length} / {MAX_CUSTOM_CHARS}
              </span>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
          <span className="text-emerald-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-4"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </span>
          <p className="flex-1 text-[12px] font-medium leading-[1.4] text-emerald-600">
            L&apos;établissement sera informé pour rendre votre accueil unique.
          </p>
        </div>
      </div>
    </ReservationShell>
  );
}
