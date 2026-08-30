import { defineConfig } from "prisma/config";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch {
  // Environment variables may already be provided by the host in production.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "pnpm exec tsx prisma/seed.ts",
  },
});
