import { ApiError, request } from "../auth/client";

const rawBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_BASE = rawBase ?? "/api";

export type AccommodationCategory =
  | "HOTEL"
  | "BED_AND_BREAKFAST"
  | "CHALET"
  | "VILLA"
  | "APARTMENT"
  | "RESORT";

export const ACCOMMODATION_CATEGORY_LABEL: Record<
  AccommodationCategory,
  string
> = {
  HOTEL: "Hôtel",
  BED_AND_BREAKFAST: "Chambre d'hôte",
  CHALET: "Chalet",
  VILLA: "Villa",
  APARTMENT: "Appartement",
  RESORT: "Resort",
};

export type AccommodationDTO = {
  id: string;
  name: string;
  description: string;
  address: string;
  category: AccommodationCategory;
  stars: number | null;
  priceFromEur: number | null;
  mainImageUrl: string | null;
  videoUrl: string | null;
  video360: boolean;
  amenities: string[];
  photos: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccommodationInput = {
  name: string;
  description: string;
  address: string;
  category: AccommodationCategory;
  stars?: number;
  priceFromEur?: number;
  mainImageUrl?: string;
  videoUrl?: string;
  video360?: boolean;
  amenities?: string[];
  photos?: string[];
};

export type UpdateAccommodationInput = {
  name?: string;
  description?: string;
  address?: string;
  category?: AccommodationCategory;
  stars?: number | null;
  priceFromEur?: number | null;
  mainImageUrl?: string | null;
  videoUrl?: string | null;
  video360?: boolean;
  amenities?: string[];
  photos?: string[];
};

export const accommodationApi = {
  listMine: (accessToken: string) =>
    request<{ accommodations: AccommodationDTO[] }>("/accommodations", {
      method: "GET",
      accessToken,
    }),

  getById: (accessToken: string, id: string) =>
    request<{ accommodation: AccommodationDTO }>(`/accommodations/${id}`, {
      method: "GET",
      accessToken,
    }),

  create: (accessToken: string, input: CreateAccommodationInput) =>
    request<{ accommodation: AccommodationDTO }>("/accommodations", {
      method: "POST",
      body: JSON.stringify(input),
      accessToken,
    }),

  update: (
    accessToken: string,
    id: string,
    input: UpdateAccommodationInput,
  ) =>
    request<{ accommodation: AccommodationDTO }>(`/accommodations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
      accessToken,
    }),

  remove: (accessToken: string, id: string) =>
    request<void>(`/accommodations/${id}`, {
      method: "DELETE",
      accessToken,
    }),

  uploadVideo: (accessToken: string, file: File) =>
    uploadAccommodationFile(accessToken, "/accommodations/video", "video", file),

  uploadImage: (accessToken: string, file: File) =>
    uploadAccommodationFile(accessToken, "/accommodations/image", "image", file),
};

const uploadAccommodationFile = async (
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
