/*
  Warnings:

  - The values [SAINT_VALENTIN] on the enum `ReservationEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationEventType_new" AS ENUM ('MARIAGE', 'EVJF', 'ANNIVERSAIRE');
ALTER TABLE "reservations" ALTER COLUMN "eventType" TYPE "ReservationEventType_new" USING ("eventType"::text::"ReservationEventType_new");
ALTER TYPE "ReservationEventType" RENAME TO "ReservationEventType_old";
ALTER TYPE "ReservationEventType_new" RENAME TO "ReservationEventType";
DROP TYPE "public"."ReservationEventType_old";
COMMIT;
