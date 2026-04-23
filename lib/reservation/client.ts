import { request } from "../auth/client";
import type {
  EventType,
  InvitedFriend,
  MichelinExtra,
  PaymentMethod,
  ReservationState,
} from "@/types/reservation";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type ReservationPaymentMethod = "APPLE_PAY" | "GOOGLE_PAY" | "CARD";

export type ReservationEventType =
  | "MARIAGE"
  | "EVJF"
  | "ANNIVERSAIRE"
  | "SAINT_VALENTIN";

export type ReservationDTO = {
  id: string;
  userId: string;
  restaurantId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomId: string | null;
  roomName: string | null;
  roomCategory: string | null;
  eventType: ReservationEventType | null;
  customRequest: string | null;
  invitedFriends: InvitedFriend[] | null;
  michelinExtras: MichelinExtra[] | null;
  paymentMethod: ReservationPaymentMethod;
  cardLast4: string | null;
  totalAmount: number;
  pricePerPerson: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    mainImageUrl: string | null;
    stars: number | null;
    chefName: string | null;
  };
};

export type CreateReservationInput = {
  restaurantId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children?: number;
  roomId?: string;
  roomName?: string;
  roomCategory?: string;
  eventType?: ReservationEventType | null;
  customRequest?: string;
  invitedFriends?: InvitedFriend[];
  michelinExtras?: MichelinExtra[];
  paymentMethod: ReservationPaymentMethod;
  cardLast4?: string;
  totalAmount: number;
  pricePerPerson: number;
};

const PAYMENT_METHOD_MAP: Record<PaymentMethod, ReservationPaymentMethod> = {
  "apple-pay": "APPLE_PAY",
  "google-pay": "GOOGLE_PAY",
  card: "CARD",
};

const EVENT_TYPE_MAP: Record<NonNullable<EventType>, ReservationEventType> = {
  mariage: "MARIAGE",
  evjf: "EVJF",
  anniversaire: "ANNIVERSAIRE",
  "saint-valentin": "SAINT_VALENTIN",
};

/** Convertit l'état local (sessionStorage) vers le DTO attendu par l'API. */
export const toCreateReservationInput = (
  state: ReservationState,
): CreateReservationInput => {
  if (!state.dates) {
    throw new Error("Dates de séjour manquantes.");
  }
  const selectedRoom = state.roomOptions.find((r) => r.selected);

  return {
    restaurantId: state.restaurantId,
    checkIn: state.dates.checkIn.toISOString(),
    checkOut: state.dates.checkOut.toISOString(),
    nights: state.dates.nights,
    adults: state.guests.adults,
    children: state.guests.children,
    roomId: selectedRoom?.id,
    roomName: selectedRoom?.name,
    roomCategory: selectedRoom?.category,
    eventType: state.personalization.type
      ? EVENT_TYPE_MAP[state.personalization.type]
      : null,
    customRequest: state.personalization.customRequest || undefined,
    invitedFriends: state.social.invitedFriends,
    michelinExtras: state.michelinExtras,
    paymentMethod: PAYMENT_METHOD_MAP[state.payment.method],
    cardLast4: state.payment.cardLast4,
    totalAmount: state.payment.totalAmount,
    pricePerPerson: state.payment.pricePerPerson,
  };
};

export const reservationApi = {
  create: (accessToken: string, input: CreateReservationInput) =>
    request<{ reservation: ReservationDTO }>("/me/reservations", {
      method: "POST",
      body: JSON.stringify(input),
      accessToken,
    }),

  list: (accessToken: string) =>
    request<{ reservations: ReservationDTO[] }>("/me/reservations", {
      method: "GET",
      accessToken,
    }),

  getById: (accessToken: string, id: string) =>
    request<{ reservation: ReservationDTO }>(`/me/reservations/${id}`, {
      method: "GET",
      accessToken,
    }),

  cancel: (accessToken: string, id: string) =>
    request<{ reservation: ReservationDTO }>(`/me/reservations/${id}`, {
      method: "DELETE",
      accessToken,
    }),
};
