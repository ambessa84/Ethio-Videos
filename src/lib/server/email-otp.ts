import { createHash, randomInt } from "node:crypto";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";

const DEFAULT_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashOtp(email: string, code: string) {
  return createHash("sha256")
    .update(`${normalizeEmail(email)}:${code}:${env.AUTH_SECRET ?? ""}`)
    .digest("hex");
}

function ttlMinutes() {
  const parsed = Number(env.EMAIL_OTP_TTL_MINUTES);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MINUTES;
}

export async function createEmailOtp(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + ttlMinutes() * 60_000);

  await prisma.emailOtp.create({
    data: {
      email: normalizedEmail,
      codeHash: hashOtp(normalizedEmail, code),
      expiresAt,
    },
  });

  if (dev || env.EMAIL_OTP_DELIVERY_MODE === "console") {
    console.info(`EthioVideos OTP for ${normalizedEmail}: ${code}`);
  }

  return {
    email: normalizedEmail,
    expiresAt,
    debugCode: dev ? code : undefined,
  };
}

export async function verifyEmailOtp(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const otp = await prisma.emailOtp.findFirst({
    where: {
      email: normalizedEmail,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otp || otp.attempts >= MAX_ATTEMPTS) return null;

  const codeMatches = otp.codeHash === hashOtp(normalizedEmail, code.trim());

  if (!codeMatches) {
    await prisma.emailOtp.update({
      where: {
        id: otp.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
    return null;
  }

  const user = await prisma.user.update({
    where: {
      email: normalizedEmail,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.emailOtp.update({
    where: {
      id: otp.id,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  return user;
}
