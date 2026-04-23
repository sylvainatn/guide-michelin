"use client";

import { useState } from "react";
import { UsersIcon, MinusIcon, PlusIcon } from "@/components/atoms/icons";
import type { GuestConfig } from "@/types/reservation";

interface GuestCounterProps {
  onGuestChange: (guests: GuestConfig) => void;
  initialGuests?: GuestConfig;
}

export const GuestCounter = ({ onGuestChange, initialGuests }: GuestCounterProps) => {
  const [guests, setGuests] = useState<GuestConfig>(
    initialGuests || { adults: 4 }
  );

  const updateGuestCount = (field: keyof GuestConfig, change: number) => {
    const newGuests = { ...guests };
    const currentValue = newGuests[field] || 0;
    const newValue = Math.max(1, currentValue + change);
    
    newGuests[field] = newValue;
    setGuests(newGuests);
    onGuestChange(newGuests);
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 flex items-center justify-between">
      {/* Left Content */}
      <div className="flex items-center gap-2.5">
        {/* Icon */}
        <div className="bg-red-50 rounded-xl w-9 h-9 flex items-center justify-center">
          <UsersIcon className="size-4 text-primary" />
        </div>
        
        {/* Text */}
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm text-tertiary">
            Voyageurs
          </span>
          <span className="text-xs text-neutral-400">
            Nombre de personnes
          </span>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center gap-3">
        {/* Minus Button */}
        <button
          onClick={() => updateGuestCount("adults", -1)}
          className="bg-neutral-200 rounded-lg w-8 h-8 flex items-center justify-center disabled:opacity-50"
          disabled={guests.adults <= 1}
        >
          <MinusIcon className="size-3.5 text-neutral-600" />
        </button>

        {/* Count Display */}
        <span className="font-semibold text-lg text-tertiary min-w-[24px] text-center">
          {guests.adults}
        </span>

        {/* Plus Button */}
        <button
          onClick={() => updateGuestCount("adults", 1)}
          className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center"
        >
          <PlusIcon className="size-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};