-- CreateEnum
CREATE TYPE "TravelEnvironment" AS ENUM ('SEA', 'MOUNTAINS', 'VINEYARDS', 'CITY');

-- CreateEnum
CREATE TYPE "CuisineStyle" AS ENUM ('TRADITION', 'CREATIVITY', 'ECO');

-- CreateEnum
CREATE TYPE "TravelStyle" AS ENUM ('GASTRONOMIC', 'ADVENTURE', 'CULTURE', 'ROMANCE');

-- CreateEnum
CREATE TYPE "TravelPace" AS ENUM ('SLOW', 'ROADTRIP');

-- CreateEnum
CREATE TYPE "TripDuration" AS ENUM ('ONE_NIGHT', 'SHORT_BREAK', 'ONE_WEEK', 'EXTENDED');

-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('DISCOVERY', 'EXCELLENCE', 'PRESTIGE');

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "environments" "TravelEnvironment"[] DEFAULT ARRAY[]::"TravelEnvironment"[],
    "cuisines" "CuisineStyle"[] DEFAULT ARRAY[]::"CuisineStyle"[],
    "travelStyle" "TravelStyle",
    "travelPace" "TravelPace",
    "tripDuration" "TripDuration",
    "budgetPerNight" INTEGER,
    "budgetTier" "BudgetTier",
    "onboardingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
