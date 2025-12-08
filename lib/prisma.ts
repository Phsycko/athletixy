// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PostgresAdapter } from '@prisma/adapter-postgresql'
import postgres from 'postgres'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configurar DATABASE_URL si no existe
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:GUgHJBmqYCW1wQZB@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

// Crear conexión postgres y adapter
const connectionString = databaseUrl
const sql = postgres(connectionString, { max: 1 })
const adapter = new PostgresAdapter(sql)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
