// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL de conexión a Supabase - debe estar disponible antes de crear PrismaClient
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
}

// Asegurar que DATABASE_URL esté configurada
const databaseUrl = getDatabaseUrl()
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

// Función para crear PrismaClient
function createPrismaClient() {
  // Verificar que DATABASE_URL esté disponible
  const url = process.env.DATABASE_URL
  if (!url || url.trim() === '') {
    throw new Error('DATABASE_URL no está configurada o está vacía')
  }

  return new PrismaClient()
}

// Función lazy para obtener PrismaClient
function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const prisma = createPrismaClient()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

// Exportar instancia - solo se crea cuando se importa
export const prisma = getPrismaClient()
