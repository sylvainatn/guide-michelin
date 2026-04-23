"use client";

import type { ReservationState } from "@/types/reservation";

const KEY_PREFIX = "gm_reservation_";

const isBrowser = () => typeof window !== "undefined";

const reviver = (key: string, value: unknown) => {
  if (
    (key === "checkIn" || key === "checkOut") &&
    typeof value === "string"
  ) {
    return new Date(value);
  }
  return value;
};

export const reservationStorage = {
  read(restaurantId: string): Partial<ReservationState> | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.sessionStorage.getItem(`${KEY_PREFIX}${restaurantId}`);
      if (!raw) return null;
      return JSON.parse(raw, reviver) as Partial<ReservationState>;
    } catch {
      return null;
    }
  },

  write(restaurantId: string, state: Partial<ReservationState>) {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.setItem(
        `${KEY_PREFIX}${restaurantId}`,
        JSON.stringify(state),
      );
    } catch {
      // ignore quota errors
    }
  },

  patch(
    restaurantId: string,
    patch: Partial<ReservationState>,
  ): Partial<ReservationState> {
    const previous = reservationStorage.read(restaurantId) ?? {};
    const next = { ...previous, ...patch };
    reservationStorage.write(restaurantId, next);
    return next;
  },

  clear(restaurantId: string) {
    if (!isBrowser()) return;
    window.sessionStorage.removeItem(`${KEY_PREFIX}${restaurantId}`);
  },
};

export const buildDefaultReservation = (
  restaurantId: string,
  overrides: Partial<ReservationState> = {},
): ReservationState => ({
  restaurantId,
  restaurantName: overrides.restaurantName,
  chefName: overrides.chefName,
  stars: overrides.stars ?? null,
  address: overrides.address,
  dates: overrides.dates ?? {
    checkIn: new Date(2025, 9, 10),
    checkOut: new Date(2025, 9, 14),
    nights: 4,
  },
  guests: overrides.guests ?? { adults: 4 },
  roomOptions:
    overrides.roomOptions ?? [
      {
        id: "suite-vignes",
        name: "Suite avec vue vignes",
        description: "Tablet Hotels · Prestige",
        category: "prestige",
        icon: "bed-double",
        selected: true,
      },
      {
        id: "chambre-classique",
        name: "Chambre Classique",
        description: "Tablet Hotels · Confort",
        category: "confort",
        icon: "bed-single",
        selected: false,
      },
    ],
  michelinExtras:
    overrides.michelinExtras ?? [
      {
        id: "menu-signature",
        name: "Inclus automatiquement",
        description: "Menu Signature en 5 temps",
        chef: "Chef",
        included: true,
      },
    ],
  personalization: overrides.personalization ?? {
    type: null,
    customRequest: "",
  },
  social: overrides.social ?? { invitedFriends: [] },
  payment: overrides.payment ?? {
    method: "apple-pay",
    cardLast4: "4242",
    totalAmount: 1940,
    pricePerPerson: 485,
  },
});
