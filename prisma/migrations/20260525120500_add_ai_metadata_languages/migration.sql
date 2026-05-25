-- CreateTable
CREATE TABLE "VideoAiMetadata" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "shortSummary" TEXT,
    "longSummary" TEXT,
    "keyPoints" TEXT,
    "tags" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "detectedLanguage" TEXT,
    "categorySuggestion" TEXT,
    "confidence" DOUBLE PRECISION,
    "needsHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "generatedAt" TIMESTAMP(3),
    "status" "AiSummaryStatus" NOT NULL DEFAULT 'NOT_GENERATED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoAiMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoAiMetadata_language_idx" ON "VideoAiMetadata"("language");

-- CreateIndex
CREATE UNIQUE INDEX "VideoAiMetadata_videoId_language_key" ON "VideoAiMetadata"("videoId", "language");

-- AddForeignKey
ALTER TABLE "VideoAiMetadata" ADD CONSTRAINT "VideoAiMetadata_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
