import { prisma } from "../../../lib/prisma";
import { NotFound } from "../../lib/errors";

const assertRestaurantExists = async (restaurantId: string) => {
  const exists = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true },
  });
  if (!exists) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
};

export const addBookmark = async (userId: string, restaurantId: string) => {
  await assertRestaurantExists(restaurantId);
  await prisma.bookmark.upsert({
    where: { userId_restaurantId: { userId, restaurantId } },
    create: { userId, restaurantId },
    update: {},
  });
};

export const removeBookmark = async (userId: string, restaurantId: string) => {
  await assertRestaurantExists(restaurantId);
  await prisma.bookmark.deleteMany({ where: { userId, restaurantId } });
};

export const addFavorite = async (userId: string, restaurantId: string) => {
  await assertRestaurantExists(restaurantId);
  await prisma.favorite.upsert({
    where: { userId_restaurantId: { userId, restaurantId } },
    create: { userId, restaurantId },
    update: {},
  });
};

export const removeFavorite = async (userId: string, restaurantId: string) => {
  await assertRestaurantExists(restaurantId);
  await prisma.favorite.deleteMany({ where: { userId, restaurantId } });
};
