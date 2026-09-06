ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "User"
  ADD COLUMN "socialProvider" TEXT,
  ADD COLUMN "socialAccountId" TEXT;

CREATE UNIQUE INDEX "User_socialProvider_socialAccountId_key"
  ON "User"("socialProvider", "socialAccountId");
