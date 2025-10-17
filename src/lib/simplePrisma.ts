// Simple Prisma client with basic retry logic
import { PrismaClient } from '@prisma/client'

// Create a single Prisma client instance
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
})

// Simple retry function
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Check if it's a connection error
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code
        
        // Retry on connection errors
        if (errorCode === 'P1001' || errorCode === 'P1002' || errorCode === 'P1008') {
          if (attempt < maxRetries) {
            console.log(`Database connection error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Exponential backoff
            continue
          }
        }
      }
      
      // If it's not a retryable error, throw immediately
      throw error
    }
  }

  throw lastError!
}

// Enhanced Prisma operations with retry
export const db = {
  business: {
    findUnique: (args: any) => withRetry(() => prisma.business.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.business.findMany(args)),
    create: (args: any) => withRetry(() => prisma.business.create(args)),
    update: (args: any) => withRetry(() => prisma.business.update(args)),
    delete: (args: any) => withRetry(() => prisma.business.delete(args)),
  },
  employee: {
    findUnique: (args: any) => withRetry(() => prisma.employee.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.employee.findMany(args)),
    create: (args: any) => withRetry(() => prisma.employee.create(args)),
    update: (args: any) => withRetry(() => prisma.employee.update(args)),
    delete: (args: any) => withRetry(() => prisma.employee.delete(args)),
  },
  service: {
    findUnique: (args: any) => withRetry(() => prisma.service.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.service.findMany(args)),
    create: (args: any) => withRetry(() => prisma.service.create(args)),
    update: (args: any) => withRetry(() => prisma.service.update(args)),
    delete: (args: any) => withRetry(() => prisma.service.delete(args)),
  },
  appointment: {
    findUnique: (args: any) => withRetry(() => prisma.appointment.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.appointment.findMany(args)),
    create: (args: any) => withRetry(() => prisma.appointment.create(args)),
    update: (args: any) => withRetry(() => prisma.appointment.update(args)),
    delete: (args: any) => withRetry(() => prisma.appointment.delete(args)),
  },
  bookingSettings: {
    findUnique: (args: any) => withRetry(() => prisma.bookingSettings.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.bookingSettings.findMany(args)),
    create: (args: any) => withRetry(() => prisma.bookingSettings.create(args)),
    update: (args: any) => withRetry(() => prisma.bookingSettings.update(args)),
    delete: (args: any) => withRetry(() => prisma.bookingSettings.delete(args)),
  },
  workingHours: {
    findUnique: (args: any) => withRetry(() => prisma.workingHours.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.workingHours.findMany(args)),
    create: (args: any) => withRetry(() => prisma.workingHours.create(args)),
    update: (args: any) => withRetry(() => prisma.workingHours.update(args)),
    delete: (args: any) => withRetry(() => prisma.workingHours.delete(args)),
  },
  timeBlock: {
    findUnique: (args: any) => withRetry(() => prisma.timeBlock.findUnique(args)),
    findMany: (args: any) => withRetry(() => prisma.timeBlock.findMany(args)),
    create: (args: any) => withRetry(() => prisma.timeBlock.create(args)),
    update: (args: any) => withRetry(() => prisma.timeBlock.update(args)),
    delete: (args: any) => withRetry(() => prisma.timeBlock.delete(args)),
  },
}

export default db
