import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimized database configuration
// Use session pooler (port 5432) - handles prepared statements properly and is IPv4 compatible
let databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_TRANSACTION

// Ensure optimal session pooler configuration
if (databaseUrl.includes(':5432')) {
  // Remove any existing parameters to avoid conflicts
  const baseUrl = databaseUrl.split('?')[0]
  // Add optimized parameters for session pooler
  databaseUrl = `${baseUrl}?pgbouncer=true&pool_timeout=0&statement_timeout=0`
}

console.log('Using optimized database URL:', databaseUrl.replace(/:[^:@]*@/, ':***@'))

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  // Optimized logging - only log errors in development
  log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
