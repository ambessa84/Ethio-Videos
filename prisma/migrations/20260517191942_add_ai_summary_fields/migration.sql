-- CreateEnum
CREATE TYPE "AiSummaryStatus" AS ENUM ('NOT_GENERATED', 'GENERATING', 'GENERATED', 'FAILED');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "aiCategorySuggestion" TEXT,
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "aiError" TEXT,
ADD COLUMN     "aiGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "aiKeyPoints" TEXT,
ADD COLUMN     "aiLanguage" TEXT,
ADD COLUMN     "aiLongSummary" TEXT,
ADD COLUMN     "aiNeedsHumanReview" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aiSeoDescription" TEXT,
ADD COLUMN     "aiSeoTitle" TEXT,
ADD COLUMN     "aiShortSummary" TEXT,
ADD COLUMN     "aiStatus" "AiSummaryStatus" NOT NULL DEFAULT 'NOT_GENERATED',
ADD COLUMN     "aiTags" TEXT;
