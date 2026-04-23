-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReservationPaymentMethod" AS ENUM ('APPLE_PAY', 'GOOGLE_PAY', 'CARD');

-- CreateEnum
CREATE TYPE "ReservationEventType" AS ENUM ('MARIAGE', 'EVJF', 'ANNIVERSAIRE', 'SAINT_VALENTIN');

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "roomId" TEXT,
    "roomName" TEXT,
    "roomCategory" TEXT,
    "eventType" "ReservationEventType",
    "customRequest" TEXT,
    "invitedFriends" JSONB,
    "michelinExtras" JSONB,
    "paymentMethod" "ReservationPaymentMethod" NOT NULL,
    "cardLast4" TEXT,
    "totalAmount" INTEGER NOT NULL,
    "pricePerPerson" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reservations_userId_idx" ON "reservations"("userId");

-- CreateIndex
CREATE INDEX "reservations_restaurantId_idx" ON "reservations"("restaurantId");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
