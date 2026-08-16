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

  await prisma.newsSource.upsert({
    where: {
      feedUrl: "https://addisstandard.com/feed/",
    },
    update: {
      name: "Addis Standard",
      slug: "addis-standard",
      siteUrl: "https://addisstandard.com/",
      language: "en",
      defaultTopic: "actualité",
      isActive: true,
    },
    create: {
      name: "Addis Standard",
      slug: "addis-standard",
      feedUrl: "https://addisstandard.com/feed/",
      siteUrl: "https://addisstandard.com/",
      language: "en",
      defaultTopic: "actualité",
    },
  });
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
