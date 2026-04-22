-- CreateTable
CREATE TABLE "michelin_reviews" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "productsScore" DOUBLE PRECISION NOT NULL,
    "harmonyScore" DOUBLE PRECISION NOT NULL,
    "masteryScore" DOUBLE PRECISION NOT NULL,
    "personalityScore" DOUBLE PRECISION NOT NULL,
    "regularityScore" DOUBLE PRECISION NOT NULL,
    "inspectorName" TEXT,
    "verdict" TEXT,
    "priceFromEur" INTEGER,
    "tripDuration" TEXT,
    "partnerBadge" TEXT,
    "locationLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "michelin_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "michelin_reviews_restaurantId_key" ON "michelin_reviews"("restaurantId");

-- AddForeignKey
ALTER TABLE "michelin_reviews" ADD CONSTRAINT "michelin_reviews_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
