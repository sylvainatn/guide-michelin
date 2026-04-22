import type { TourConfig } from "./tour-stops";
import { ApiError, request } from "../auth/client";

const rawBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_BASE = rawBase ?? "/api";

export type PriceRange = "EUR" | "EUREUR" | "EUREUREUR" | "EUREUREUREUR";

export type RestaurantDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string | null;
  chefName: string | null;
  stars: number | null;
  priceRange: PriceRange | null;
  style: string[];
  tourStops: TourConfig | null;
  photos360: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type RestaurantDetailDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string | null;
  chefName: string | null;
  stars: number | null;
  priceRange: PriceRange | null;
  style: string[];
  tourStops: TourConfig | null;
  photos360: string[];
  createdAt: string;
};

export type CreateRestaurantInput = {
  name: string;
  description: string;
  address: string;
  videoUrl?: string;
  chefName?: string;
  stars?: number;
  priceRange?: PriceRange;
  style?: string[];
};

export type FeedRestaurantDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string;
  chefName: string | null;
  stars: number | null;
  style: string[];
  createdAt: string;
};

export const restaurantApi = {
  create: (accessToken: string, input: CreateRestaurantInput) =>
    request<{ restaurant: RestaurantDTO }>("/restaurants", {
      method: "POST",
      body: JSON.stringify(input),
      accessToken,
    }),

  listMine: (accessToken: string) =>
    request<{ restaurants: RestaurantDTO[] }>("/restaurants", {
      method: "GET",
      accessToken,
    }),

  feed: (accessToken: string) =>
    request<{ restaurants: FeedRestaurantDTO[] }>("/restaurants/feed", {
      method: "GET",
      accessToken,
    }),

  getById: (accessToken: string, id: string) =>
    request<{ restaurant: RestaurantDetailDTO }>(`/restaurants/${id}`, {
      method: "GET",
      accessToken,
    }),

  uploadVideo: async (
    accessToken: string,
    file: File,
  ): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("video", file);
    const res = await fetch(`${API_BASE}/restaurants/video`, {
      method: "POST",
      body: form,
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = body.error ?? {};
      throw new ApiError(
        res.status,
        err.code ?? "unknown_error",
        err.message ?? res.statusText,
        err.details,
      );
    }
    return body as { url: string };
  },
};
