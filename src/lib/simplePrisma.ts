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
        const errorCode = (error as { code: string }).code
        
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
    findUnique: (args: Parameters<typeof prisma.business.findUnique>[0]) => withRetry(() => prisma.business.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.business.findMany>[0]) => withRetry(() => prisma.business.findMany(args)),
    create: (args: Parameters<typeof prisma.business.create>[0]) => withRetry(() => prisma.business.create(args)),
    update: (args: Parameters<typeof prisma.business.update>[0]) => withRetry(() => prisma.business.update(args)),
    delete: (args: Parameters<typeof prisma.business.delete>[0]) => withRetry(() => prisma.business.delete(args)),
  },
  employee: {
    findUnique: (args: Parameters<typeof prisma.employee.findUnique>[0]) => withRetry(() => prisma.employee.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.employee.findMany>[0]) => withRetry(() => prisma.employee.findMany(args)),
    create: (args: Parameters<typeof prisma.employee.create>[0]) => withRetry(() => prisma.employee.create(args)),
    update: (args: Parameters<typeof prisma.employee.update>[0]) => withRetry(() => prisma.employee.update(args)),
    delete: (args: Parameters<typeof prisma.employee.delete>[0]) => withRetry(() => prisma.employee.delete(args)),
  },
  service: {
    findUnique: (args: Parameters<typeof prisma.service.findUnique>[0]) => withRetry(() => prisma.service.findUnique(args)),
    findFirst: (args: Parameters<typeof prisma.service.findFirst>[0]) => withRetry(() => prisma.service.findFirst(args)),
    findMany: (args: Parameters<typeof prisma.service.findMany>[0]) => withRetry(() => prisma.service.findMany(args)),
    create: (args: Parameters<typeof prisma.service.create>[0]) => withRetry(() => prisma.service.create(args)),
    update: (args: Parameters<typeof prisma.service.update>[0]) => withRetry(() => prisma.service.update(args)),
    delete: (args: Parameters<typeof prisma.service.delete>[0]) => withRetry(() => prisma.service.delete(args)),
  },
  appointment: {
    findUnique: (args: Parameters<typeof prisma.appointment.findUnique>[0]) => withRetry(() => prisma.appointment.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.appointment.findMany>[0]) => withRetry(() => prisma.appointment.findMany(args)),
    create: (args: Parameters<typeof prisma.appointment.create>[0]) => withRetry(() => prisma.appointment.create(args)),
    update: (args: Parameters<typeof prisma.appointment.update>[0]) => withRetry(() => prisma.appointment.update(args)),
    delete: (args: Parameters<typeof prisma.appointment.delete>[0]) => withRetry(() => prisma.appointment.delete(args)),
  },
  bookingSettings: {
    findUnique: (args: Parameters<typeof prisma.bookingSettings.findUnique>[0]) => withRetry(() => prisma.bookingSettings.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.bookingSettings.findMany>[0]) => withRetry(() => prisma.bookingSettings.findMany(args)),
    create: (args: Parameters<typeof prisma.bookingSettings.create>[0]) => withRetry(() => prisma.bookingSettings.create(args)),
    update: (args: Parameters<typeof prisma.bookingSettings.update>[0]) => withRetry(() => prisma.bookingSettings.update(args)),
    delete: (args: Parameters<typeof prisma.bookingSettings.delete>[0]) => withRetry(() => prisma.bookingSettings.delete(args)),
  },
  workingHours: {
    findUnique: (args: Parameters<typeof prisma.workingHours.findUnique>[0]) => withRetry(() => prisma.workingHours.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.workingHours.findMany>[0]) => withRetry(() => prisma.workingHours.findMany(args)),
    create: (args: Parameters<typeof prisma.workingHours.create>[0]) => withRetry(() => prisma.workingHours.create(args)),
    update: (args: Parameters<typeof prisma.workingHours.update>[0]) => withRetry(() => prisma.workingHours.update(args)),
    delete: (args: Parameters<typeof prisma.workingHours.delete>[0]) => withRetry(() => prisma.workingHours.delete(args)),
  },
  timeBlock: {
    findUnique: (args: Parameters<typeof prisma.timeBlock.findUnique>[0]) => withRetry(() => prisma.timeBlock.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.timeBlock.findMany>[0]) => withRetry(() => prisma.timeBlock.findMany(args)),
    create: (args: Parameters<typeof prisma.timeBlock.create>[0]) => withRetry(() => prisma.timeBlock.create(args)),
    update: (args: Parameters<typeof prisma.timeBlock.update>[0]) => withRetry(() => prisma.timeBlock.update(args)),
    delete: (args: Parameters<typeof prisma.timeBlock.delete>[0]) => withRetry(() => prisma.timeBlock.delete(args)),
  },
}

export default db
