import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
import { env } from 'process';

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        errorFormat: 'pretty'
    })


if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;