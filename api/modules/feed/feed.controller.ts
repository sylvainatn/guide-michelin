import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";

export const listFeed = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const [restaurants, bookmarks, favorites, accommodations] = await Promise.all(
    [
      prisma.restaurant.findMany({
        where: { videoUrl: { not: null } },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          videoUrl: true,
          mainImageUrl: true,
          stars: true,
          chefName: true,
          style: true,
          createdAt: true,
        },
      }),
      prisma.bookmark.findMany({
        where: { userId },
        select: { restaurantId: true },
      }),
      prisma.favorite.findMany({
        where: { userId },
        select: { restaurantId: true },
      }),
      prisma.accommodation.findMany({
        where: { videoUrl: { not: null } },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          videoUrl: true,
          mainImageUrl: true,
          stars: true,
          category: true,
          priceFromEur: true,
          createdAt: true,
        },
      }),
    ],
  );

  const bookmarkedSet = new Set(bookmarks.map((b) => b.restaurantId));
  const favoritedSet = new Set(favorites.map((f) => f.restaurantId));

  const restaurantItems = restaurants.map((r) => ({
    kind: "restaurant" as const,
    ...r,
    bookmarkedByMe: bookmarkedSet.has(r.id),
    favoritedByMe: favoritedSet.has(r.id),
  }));

  const accommodationItems = accommodations.map((a) => ({
    kind: "accommodation" as const,
    ...a,
  }));

  const items = [...restaurantItems, ...accommodationItems].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  res.json({ items });
};
