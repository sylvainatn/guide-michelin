import { ApiError, request } from "../auth/client";

const rawBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_BASE = rawBase ?? "/api";

export type RestaurantDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRestaurantInput = {
  name: string;
  description: string;
  address: string;
  videoUrl?: string;
};

export type UpdateRestaurantInput = {
  name?: string;
  description?: string;
  address?: string;
  // null = supprimer la vidéo existante, string = nouvelle URL, undefined = inchangé.
  videoUrl?: string | null;
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
    request<{ restaurant: RestaurantDTO }>(`/restaurants/${id}`, {
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
