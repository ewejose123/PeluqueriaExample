// Optimized database retry utility for handling intermittent connection errors
import { prisma } from './prisma'

interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoffMultiplier?: number
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 2, // Reduced from 3 for faster failure
  delay: 500,    // Reduced from 1000ms for faster retry
  backoffMultiplier: 2
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, delay, backoffMultiplier } = { ...defaultOptions, ...options }
  
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Check if it's a retryable database error
      const isRetryableError = error && typeof error === 'object' && 'code' in error && (
        error.code === 'P1001' || // Connection error
        error.code === '42P05' || // Prepared statement already exists
        error.code === '08P01' || // Bind message parameter mismatch
        error.message?.includes('prepared statement') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('already exists') ||
        error.message?.includes('connection') ||
        error.message?.includes('timeout')
      )
      
      if (isRetryableError && attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoffMultiplier, attempt)
        console.log(`Database error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitTime}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      
      // If it's not a retryable error or we've exhausted retries, throw immediately
      throw error
    }
  }
  
  throw lastError!
}

// Optimized helper function to retry Prisma operations
export async function retryPrismaOperation<T>(
  operation: (prisma: typeof prisma) => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return withRetry(() => operation(prisma), options)
}
