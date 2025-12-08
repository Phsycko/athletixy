// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Función lazy para obtener PrismaClient
function getPrismaClient() {
  // Configurar DATABASE_URL si no existe (para Vercel)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const prisma = new PrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

// Exportar función en lugar de instancia directa
export const prisma = getPrismaClient()
