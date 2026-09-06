import { loadEnvFile } from "node:process";
import { importNewsFeeds } from "../src/lib/server/import-news";
import { prisma } from "../src/lib/server/prisma";

try {
  loadEnvFile();
} catch {
  // Hosts can provide DATABASE_URL and other values without a local .env file.
}

async function main() {
  const results = await importNewsFeeds();
  const totals = results.reduce(
    (summary, result) => ({
      imported: summary.imported + result.imported,
      skipped: summary.skipped + result.skipped,
      failed: summary.failed + (result.error ? 1 : 0),
    }),
    { imported: 0, skipped: 0, failed: 0 },
  );

  for (const result of results) {
    const status = result.error ? "failed" : "ok";
    const details = result.error
      ? `error="${result.error}"`
      : `imported=${result.imported} skipped=${result.skipped}`;

    console.log(`${status} ${result.source}: ${details}`);
  }

  console.log(
    `news import complete: imported=${totals.imported} skipped=${totals.skipped} failed=${totals.failed}`,
  );

  if (totals.failed === results.length && results.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
