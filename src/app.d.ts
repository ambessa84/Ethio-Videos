import type { PrismaClient } from "@prisma/client";

declare global {
  namespace App {
    interface Locals {
      isAdmin: boolean;
      isAuthenticated: boolean;
    }
  }

  var prisma: PrismaClient | undefined;
}

export {};
