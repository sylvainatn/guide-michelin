-- AlterTable
ALTER TABLE "restaurants"
  ADD COLUMN "chefName" TEXT,
  ADD COLUMN "stars" INTEGER,
  ADD COLUMN "priceRange" TEXT,
  ADD COLUMN "style" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "tourStops" JSONB,
  ADD COLUMN "photos360" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
