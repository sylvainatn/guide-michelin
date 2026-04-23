export interface ReservationDates {
  checkIn: Date;
  checkOut: Date;
  nights: number;
}

export interface GuestConfig {
  adults: number;
  children?: number;
}

export interface RoomOption {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  selected: boolean;
  price?: number;
}

export interface MichelinExtra {
  id: string;
  name: string;
  description: string;
  included: boolean;
  chef?: string;
}

export type EventType =
  | "mariage"
  | "evjf"
  | "anniversaire"
  | "saint-valentin"
  | null;

export interface EventPersonalization {
  type: EventType;
  customRequest: string;
}

export interface InvitedFriend {
  id: string;
  name: string;
  handle?: string;
  initial: string;
  color: string;
  status: "invited" | "pending" | "confirmed";
}

export interface SocialStep {
  invitedFriends: InvitedFriend[];
}

export type PaymentMethod = "apple-pay" | "google-pay" | "card";

export interface PaymentInfo {
  method: PaymentMethod;
  cardLast4?: string;
  totalAmount: number;
  pricePerPerson: number;
}

export interface ReservationStep1 {
  restaurantId: string;
  restaurantName: string;
  michelinStars: number;
  dates?: ReservationDates;
  guests: GuestConfig;
  roomOptions: RoomOption[];
  michelinExtras: MichelinExtra[];
}

export interface ReservationState {
  restaurantId: string;
  restaurantName?: string;
  chefName?: string;
  stars?: number | null;
  address?: string;
  dates?: ReservationDates;
  guests: GuestConfig;
  roomOptions: RoomOption[];
  michelinExtras: MichelinExtra[];
  personalization: EventPersonalization;
  social: SocialStep;
  payment: PaymentInfo;
}

export type ReservationStepType = 1 | 2 | 3 | 4 | 5;
