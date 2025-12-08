// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configurar DATABASE_URL si no existe
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
