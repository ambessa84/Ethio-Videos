-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "autoImportEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "defaultCategoryId" TEXT,
ADD COLUMN     "defaultLanguage" TEXT,
ADD COLUMN     "defaultStatus" "VideoStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "lastImportedAt" TIMESTAMP(3),
ADD COLUMN     "uploadsPlaylistId" TEXT;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_defaultCategoryId_fkey" FOREIGN KEY ("defaultCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
