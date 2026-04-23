"use client";

import {
  BedIcon,
  CalendarIcon,
  HeartIcon,
  UsersIcon,
} from "@/components/atoms/icons";
import type { ReservationState } from "@/types/reservation";

const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

const formatDateRange = (a: Date, b: Date) =>
  `${a.getDate()} – ${b.getDate()} ${MONTHS_SHORT[b.getMonth()]} ${b.getFullYear()}`;

const formatEventLabel = (type: ReservationState["personalization"]["type"]) => {
  if (type === "mariage") return "Mariage";
  if (type === "evjf") return "EVJF / EVG";
  if (type === "anniversaire") return "Anniversaire";
  if (type === "saint-valentin") return "Saint-Valentin";
  return null;
};

type Props = {
  reservation: ReservationState;
};

export const RecapCard = ({ reservation }: Props) => {
  const room = reservation.roomOptions.find((r) => r.selected);
  const menu = reservation.michelinExtras[0];
  const event = formatEventLabel(reservation.personalization.type);

  return (
    <div className="flex flex-col gap-3.5 rounded-[20px] border-2 border-primary bg-primary/5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-['Playfair_Display',serif] text-[18px] font-bold text-primary">
          {reservation.restaurantName ?? "Escapade"}
        </h3>
        {reservation.stars ? (
          <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-semibold text-white">
            ★ {reservation.stars} Étoile
            {reservation.stars > 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      <div className="h-px bg-primary/40" />

      <div className="flex items-center justify-between text-[13px] font-medium text-primary">
        <span className="inline-flex items-center gap-2">
          <CalendarIcon className="size-3.5" />
          {reservation.dates
            ? formatDateRange(reservation.dates.checkIn, reservation.dates.checkOut)
            : "Dates à définir"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <UsersIcon className="size-3.5" />
          {reservation.guests.adults} personne
          {reservation.guests.adults > 1 ? "s" : ""}
        </span>
      </div>

      {room && (
        <div className="flex items-center gap-2 text-[13px] font-medium text-primary">
          <BedIcon className="size-3.5" />
          <span className="flex-1">
            {room.name} · {room.description.split(" · ")[0]}
          </span>
        </div>
      )}

      {menu && (
        <div className="flex items-center gap-2 text-[13px] font-medium text-primary">
          <span className="text-[14px] font-bold">★</span>
          <span className="flex-1">
            {menu.description}
            {menu.chef ? ` · Chef ${menu.chef}` : ""}
          </span>
        </div>
      )}

      {event && (
        <div className="flex items-center gap-2 text-[12px] text-primary">
          <HeartIcon className="size-3.5" />
          <span className="flex-1">
            {event}
            {reservation.personalization.customRequest
              ? " · Sur-mesure activé"
              : ""}
          </span>
        </div>
      )}

      <div className="h-px bg-primary/40" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[12px] text-primary">Prix total</span>
          <span className="text-[11px] font-semibold text-primary">
            Tout inclus
          </span>
        </div>
        <div className="flex items-baseline gap-1 text-primary">
          <span className="font-['Playfair_Display',serif] text-[28px] font-bold leading-none">
            {reservation.payment.totalAmount.toLocaleString("fr-FR")} €
          </span>
          <span className="text-[13px]">
            / {reservation.guests.adults} pers.
          </span>
        </div>
      </div>
    </div>
  );
};
