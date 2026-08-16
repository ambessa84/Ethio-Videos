import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/server/prisma";
import { createSlug } from "../src/lib/server/slug";

const source = {
  name: "Addis Standard",
  slug: "addis-standard",
  feedUrl: "https://addisstandard.com/feed/",
  siteUrl: "https://addisstandard.com/",
  language: "en",
  defaultTopic: "actualité",
};

const articles = [
  {
    title:
      "AI-driven lender Optasia eyes entry into Ethiopia as expansion targets credit-starved market",
    sourceUrl: "https://addisstandard.com/?p=58516",
    excerpt:
      "AI-driven digital lending platform Optasia is planning to expand into Ethiopia as part of a broader push into underserved African credit markets.",
    publishedAt: new Date("2026-08-16T00:00:00.000Z"),
  },
  {
    title:
      "Selective Memory, Historical Distortion: Weaponization of Emperor Yohannes IV's legacy, Ethiopia's reconciliation challenge",
    sourceUrl: "https://addisstandard.com/?p=58508",
    excerpt:
      "A commentary on contested historical memory, national reconciliation, and the political use of Emperor Yohannes IV's legacy.",
    publishedAt: new Date("2026-08-16T00:00:00.000Z"),
  },
  {
    title:
      "Ethiopia: Farmers allege rising Arjo-Dhidheessa Dam reservoir caused flooding, damaged homes and crops",
    sourceUrl: "https://addisstandard.com/?p=58646",
    excerpt:
      "Residents in Oromia say the rising Arjo-Dhidheessa Dam reservoir damaged farmland, homes and crops while district authorities assess the impact.",
    publishedAt: new Date("2026-08-16T00:00:00.000Z"),
  },
  {
    title: "Djibouti, EU sign Red Sea maritime security cooperation agreement",
    sourceUrl: "https://addisstandard.com/?p=58382",
    excerpt:
      "Djibouti and the European Union signed a Status of Forces Agreement linked to EUNAVFOR ASPIDES and Red Sea maritime security.",
    publishedAt: new Date("2026-08-15T00:00:00.000Z"),
  },
  {
    title:
      "AfDB approves $110 million for Ethiopia's first private 300 MW wind power project",
    sourceUrl: "https://addisstandard.com/?p=58375",
    excerpt:
      "The African Development Bank approved financing for the Aysha Wind Project, planned as Ethiopia's first wind-based independent power producer.",
    publishedAt: new Date("2026-08-15T00:00:00.000Z"),
  },
  {
    title:
      "Ethiopia's Federal Budget Paradox: Booming in Birr, Stagnant in Dollars",
    sourceUrl: "https://addisstandard.com/?p=58167",
    excerpt:
      "A commentary examining Ethiopia's federal budget growth in birr and its limited movement when converted to US dollars.",
    publishedAt: new Date("2026-08-15T00:00:00.000Z"),
  },
];

async function main() {
  const [newsSource] = await prisma.$queryRaw<Array<{ id: string }>>`
    INSERT INTO "NewsSource" (
      id,
      slug,
      name,
      "feedUrl",
      "siteUrl",
      language,
      "defaultTopic",
      "isActive",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${randomUUID()},
      ${source.slug},
      ${source.name},
      ${source.feedUrl},
      ${source.siteUrl},
      ${source.language},
      ${source.defaultTopic},
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT ("feedUrl") DO UPDATE SET
      slug = EXCLUDED.slug,
      name = EXCLUDED.name,
      "siteUrl" = EXCLUDED."siteUrl",
      language = EXCLUDED.language,
      "defaultTopic" = EXCLUDED."defaultTopic",
      "isActive" = true,
      "updatedAt" = NOW()
    RETURNING id
  `;

  let imported = 0;
  let updated = 0;

  for (const article of articles) {
    const slug = createSlug(article.title).slice(0, 180);
    const rows = await prisma.$queryRaw<Array<{ inserted: boolean }>>`
      INSERT INTO "NewsArticle" (
        id,
        "sourceId",
        "sourceUrl",
        slug,
        title,
        excerpt,
        topic,
        language,
        "publishedAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${newsSource.id},
        ${article.sourceUrl},
        ${slug},
        ${article.title},
        ${article.excerpt},
        ${source.defaultTopic},
        ${source.language},
        ${article.publishedAt},
        NOW(),
        NOW()
      )
      ON CONFLICT ("sourceUrl") DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        topic = EXCLUDED.topic,
        language = EXCLUDED.language,
        "publishedAt" = EXCLUDED."publishedAt",
        "updatedAt" = NOW()
      RETURNING xmax = 0 AS inserted
    `;

    if (rows[0]?.inserted) {
      imported += 1;
    } else {
      updated += 1;
    }
  }

  console.log(
    JSON.stringify({
      source: source.name,
      imported,
      updated,
      total: articles.length,
    }),
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
