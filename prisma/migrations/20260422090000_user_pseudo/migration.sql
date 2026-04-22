-- AlterTable: add pseudo column (nullable for backfill)
ALTER TABLE "users" ADD COLUMN "pseudo" TEXT;

-- Backfill: derive a unique pseudo from the email local-part + first 8 chars of the user id
UPDATE "users"
SET "pseudo" = CONCAT(split_part("email", '@', 1), '_', substr("id", 1, 8));

-- Enforce NOT NULL
ALTER TABLE "users" ALTER COLUMN "pseudo" SET NOT NULL;

-- Unique index
CREATE UNIQUE INDEX "users_pseudo_key" ON "users"("pseudo");
