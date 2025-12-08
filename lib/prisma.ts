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

// Configurar DATABASE_URL en process.env antes de importar PrismaClient
// Esto es crítico para Prisma v7
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = getDatabaseUrl()
}

// Función para crear PrismaClient
function createPrismaClient() {
  // Asegurar que DATABASE_URL esté disponible
  const url = getDatabaseUrl()
  
  // Verificar que la URL sea válida
  if (!url || !url.startsWith('postgresql://')) {
    throw new Error(`DATABASE_URL inválida: ${url}`)
  }

  // Asegurar que process.env.DATABASE_URL esté configurada
  // Prisma v7 lee automáticamente DATABASE_URL de process.env
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = url
  }

  try {
    // En Prisma v7, PrismaClient lee automáticamente DATABASE_URL de process.env
    // No necesitamos pasar parámetros especiales si DATABASE_URL está configurada
    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    
    return prisma
  } catch (error: any) {
    console.error('Error creando PrismaClient:', error)
    console.error('DATABASE_URL disponible:', !!process.env.DATABASE_URL)
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

// Exportar instancia usando función lazy
let prismaInstance: PrismaClient | undefined = undefined

export const prisma = (() => {
  if (prismaInstance) {
    return prismaInstance
  }
  prismaInstance = getPrismaClient()
  return prismaInstance
})()
