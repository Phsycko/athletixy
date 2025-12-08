// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL de conexión a Supabase
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

// Asegurar que DATABASE_URL esté configurada antes de crear PrismaClient
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

// Función lazy para obtener PrismaClient
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Verificar que DATABASE_URL esté disponible
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL no está configurada')
  }

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

// Exportar instancia
export const prisma = getPrismaClient()
