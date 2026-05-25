-- CreateEnum
CREATE TYPE "LocalizedVideoStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "VideoAiMetadata" ADD COLUMN "localizedStatus" "LocalizedVideoStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "VideoAiMetadata_language_localizedStatus_idx" ON "VideoAiMetadata"("language", "localizedStatus");
