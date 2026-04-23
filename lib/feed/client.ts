import type { AccommodationCategory } from "../accommodations/client";
import { request } from "../auth/client";

export type FeedRestaurantItem = {
  kind: "restaurant";
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string;
  mainImageUrl: string | null;
  stars: number | null;
  chefName: string | null;
  style: string[];
  createdAt: string;
  bookmarkedByMe: boolean;
  favoritedByMe: boolean;
};

export type FeedAccommodationItem = {
  kind: "accommodation";
  id: string;
  name: string;
  description: string;
  address: string;
  videoUrl: string;
  mainImageUrl: string | null;
  stars: number | null;
  category: AccommodationCategory;
  priceFromEur: number | null;
  createdAt: string;
};

export type FeedItem = FeedRestaurantItem | FeedAccommodationItem;

export const feedApi = {
  list: (accessToken: string) =>
    request<{ items: FeedItem[] }>("/feed", {
      method: "GET",
      accessToken,
    }),
};
