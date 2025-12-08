// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configurar DATABASE_URL si no existe (para Vercel)
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
}

// Función para crear PrismaClient con la URL correcta
const createPrismaClient = () => {
  const url = getDatabaseUrl()
  // Asegurar que DATABASE_URL esté configurada
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = url
  }
  return new PrismaClient()
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
