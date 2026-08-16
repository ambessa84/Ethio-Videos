CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "feedUrl" TEXT NOT NULL,
    "siteUrl" TEXT,
    "language" TEXT,
    "defaultTopic" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastFetchedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "imageUrl" TEXT,
    "author" TEXT,
    "topic" TEXT,
    "language" TEXT,
    "publishedAt" TIMESTAMP(3),
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsSource_slug_key" ON "NewsSource"("slug");
CREATE UNIQUE INDEX "NewsSource_feedUrl_key" ON "NewsSource"("feedUrl");
CREATE INDEX "NewsSource_isActive_idx" ON "NewsSource"("isActive");
CREATE INDEX "NewsSource_language_idx" ON "NewsSource"("language");

CREATE UNIQUE INDEX "NewsArticle_sourceUrl_key" ON "NewsArticle"("sourceUrl");
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");
CREATE INDEX "NewsArticle_sourceId_idx" ON "NewsArticle"("sourceId");
CREATE INDEX "NewsArticle_language_idx" ON "NewsArticle"("language");
CREATE INDEX "NewsArticle_topic_idx" ON "NewsArticle"("topic");

ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
