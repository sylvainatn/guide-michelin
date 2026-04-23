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
  mainImageUrl: string | null;
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

export type MichelinReviewDTO = {
  productsScore: number;
  harmonyScore: number;
  masteryScore: number;
  personalityScore: number;
  regularityScore: number;
  inspectorName: string | null;
  verdict: string | null;
  priceFromEur: number | null;
  tripDuration: string | null;
  partnerBadge: string | null;
  locationLabel: string | null;
};

export type RestaurantDetailDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string | null;
  mainImageUrl: string | null;
  chefName: string | null;
  stars: number | null;
  priceRange: PriceRange | null;
  style: string[];
  tourStops: TourConfig | null;
  photos360: string[];
  createdAt: string;
  review: MichelinReviewDTO | null;
};

export type CreateRestaurantInput = {
  name: string;
  description: string;
  address: string;
  videoUrl?: string;
  mainImageUrl?: string;
  chefName?: string;
  stars?: number;
  priceRange?: PriceRange;
  style?: string[];
};

// Pour PATCH : `undefined` = champ inchange, `null` = efface la valeur
// cote back (optionnel). Les champs requis cote modele (name/description/
// address) ne peuvent pas etre mis a null.
export type UpdateRestaurantInput = {
  name?: string;
  description?: string;
  address?: string;
  videoUrl?: string | null;
  mainImageUrl?: string | null;
  chefName?: string | null;
  stars?: number | null;
  priceRange?: PriceRange | null;
  style?: string[];
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

  getById: (accessToken: string, id: string) =>
    request<{ restaurant: RestaurantDetailDTO }>(`/restaurants/${id}`, {
      method: "GET",
      accessToken,
    }),

  update: (accessToken: string, id: string, input: UpdateRestaurantInput) =>
    request<{ restaurant: RestaurantDTO }>(`/restaurants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
      accessToken,
    }),

  remove: (accessToken: string, id: string) =>
    request<void>(`/restaurants/${id}`, {
      method: "DELETE",
      accessToken,
    }),

  setBookmark: (accessToken: string, id: string, bookmarked: boolean) =>
    request<{ restaurantId: string; bookmarked: boolean }>(
      `/me/bookmarks/${id}`,
      {
        method: bookmarked ? "PUT" : "DELETE",
        accessToken,
      },
    ),

  setFavorite: (accessToken: string, id: string, favorited: boolean) =>
    request<{ restaurantId: string; favorited: boolean }>(
      `/me/favorites/${id}`,
      {
        method: favorited ? "PUT" : "DELETE",
        accessToken,
      },
    ),

  uploadVideo: (accessToken: string, file: File) =>
    uploadFormFile(accessToken, "/restaurants/video", "video", file),

  uploadImage: (accessToken: string, file: File) =>
    uploadFormFile(accessToken, "/restaurants/image", "image", file),
};

const uploadFormFile = async (
  accessToken: string,
  path: string,
  fieldName: string,
  file: File,
): Promise<{ url: string }> => {
  const form = new FormData();
  form.append(fieldName, file);
  const res = await fetch(`${API_BASE}${path}`, {
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
};
