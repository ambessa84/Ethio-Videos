-- AlterTable
ALTER TABLE "VideoAiMetadata" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VideoAiMetadata_language_slug_key" ON "VideoAiMetadata"("language", "slug");
