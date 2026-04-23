-- CreateEnum
CREATE TYPE "AccommodationCategory" AS ENUM ('HOTEL', 'BED_AND_BREAKFAST', 'CHALET', 'VILLA', 'APARTMENT', 'RESORT');

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "category" "AccommodationCategory" NOT NULL,
    "stars" INTEGER,
    "priceFromEur" INTEGER,
    "mainImageUrl" TEXT,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accommodations_ownerId_idx" ON "accommodations"("ownerId");

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
