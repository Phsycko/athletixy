// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL de conexión a Supabase
const DATABASE_URL_FALLBACK = "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

// Función para obtener DATABASE_URL
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || DATABASE_URL_FALLBACK
  if (!url || url.trim() === '') {
    throw new Error('DATABASE_URL no está configurada o está vacía')
  }
  return url
}

// Configurar DATABASE_URL si no existe
const databaseUrl = getDatabaseUrl()
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

// Función para crear PrismaClient
function createPrismaClient() {
  // Asegurar que DATABASE_URL esté disponible
  const url = getDatabaseUrl()
  
  // Verificar que la URL sea válida
  if (!url || !url.startsWith('postgresql://')) {
    throw new Error(`DATABASE_URL inválida: ${url}`)
  }

  try {
    // En Prisma v7, PrismaClient lee DATABASE_URL de process.env automáticamente
    return new PrismaClient()
  } catch (error: any) {
    console.error('Error creando PrismaClient:', error)
    throw new Error(`Error al inicializar Prisma Client: ${error.message}`)
  }
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
