import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Music",
    description: "Ethiopian music videos, artists and performances.",
  },
  {
    name: "Drama",
    description: "Amharic, Oromo and Ethiopian drama videos.",
  },
  {
    name: "Comedy",
    description: "Ethiopian comedy, sketches and entertainment.",
  },
  {
    name: "Religion",
    description: "Religious videos, mezmur and spiritual content.",
  },
  {
    name: "Diaspora",
    description: "Videos for Ethiopian communities around the world.",
  },
  {
    name: "Business",
    description: "Business, investment and entrepreneurship content.",
  },
  {
    name: "Culture",
    description: "Ethiopian culture, history, food and lifestyle.",
  },
  {
    name: "Sport",
    description: "Ethiopian sports videos and highlights.",
  },
];

const newsSources = [
  {
    name: "Addis Standard",
    slug: "addis-standard",
    feedUrl: "https://addisstandard.com/feed/",
    siteUrl: "https://addisstandard.com/",
    language: "en",
    defaultTopic: "actualite",
  },
  {
    name: "Addis Fortune",
    slug: "addis-fortune",
    feedUrl: "https://addisfortune.news/feed/",
    siteUrl: "https://addisfortune.news/",
    language: "en",
    defaultTopic: "business",
  },
  {
    name: "Walta",
    slug: "walta",
    feedUrl: "https://www.waltainfo.com/feed/",
    siteUrl: "https://www.waltainfo.com/",
    language: "en",
    defaultTopic: "actualite",
  },
  {
    name: "Fana BC English",
    slug: "fana-bc-english",
    feedUrl: "https://www.fanabc.com/english/feed/",
    siteUrl: "https://www.fanabc.com/english/",
    language: "en",
    defaultTopic: "actualite",
  },
  {
    name: "Ethiopian Press Agency English",
    slug: "ethiopian-press-agency-english",
    feedUrl: "https://www.press.et/english/feed/",
    siteUrl: "https://www.press.et/english/",
    language: "en",
    defaultTopic: "actualite",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: slugify(category.name, { lower: true, strict: true }),
      },
      update: {
        description: category.description,
      },
      create: {
        name: category.name,
        slug: slugify(category.name, { lower: true, strict: true }),
        description: category.description,
      },
    });
  }

  await prisma.category.deleteMany({
    where: {
      slug: "news",
      videos: { none: {} },
      channels: { none: {} },
    },
  });

  for (const source of newsSources) {
    await prisma.newsSource.upsert({
      where: {
        feedUrl: source.feedUrl,
      },
      update: {
        name: source.name,
        slug: source.slug,
        siteUrl: source.siteUrl,
        language: source.language,
        defaultTopic: source.defaultTopic,
        isActive: true,
      },
      create: source,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
