import type { PrismaClient } from "@prisma/client";

declare global {
  namespace App {
    interface Locals {
      isAdmin: boolean;
    }
  }

  var prisma: PrismaClient | undefined;
}

export {};
