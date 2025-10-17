// Production-ready database retry utility with circuit breaker pattern
import { database } from './database'

interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoffMultiplier?: number
  timeout?: number
  circuitBreakerThreshold?: number
}

interface CircuitBreakerState {
  failures: number
  lastFailureTime: number
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
}

class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    state: 'CLOSED'
  }
  
  private readonly threshold: number
  private readonly timeout: number

  constructor(threshold: number = 5, timeout: number = 60000) {
    this.threshold = threshold
    this.timeout = timeout
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === 'OPEN') {
      if (Date.now() - this.state.lastFailureTime > this.timeout) {
        this.state.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN - too many failures')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.state.failures = 0
    this.state.state = 'CLOSED'
  }

  private onFailure() {
    this.state.failures++
    this.state.lastFailureTime = Date.now()
    
    if (this.state.failures >= this.threshold) {
      this.state.state = 'OPEN'
    }
  }

  getState() {
    return {
      ...this.state,
      isHealthy: this.state.state === 'CLOSED'
    }
  }
}

const circuitBreaker = new CircuitBreaker(5, 60000)

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  backoffMultiplier: 2,
  timeout: 30000,
  circuitBreakerThreshold: 5
}

// Enhanced retry with circuit breaker and exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, delay, backoffMultiplier, timeout } = { ...defaultOptions, ...options }

  // Wrap operation with timeout
  const operationWithTimeout = async (): Promise<T> => {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ])
  }

  // Use circuit breaker
  return circuitBreaker.execute(async () => {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operationWithTimeout()
      } catch (error) {
        lastError = error as Error

        // Check if it's a retryable database error
        const isRetryableError = error && typeof error === 'object' && (
          'code' in error && (
            error.code === 'P1001' || // Connection error
            error.code === 'P1002' || // Database server closed connection
            error.code === 'P1008' || // Operation timed out
            error.code === 'P1017' || // Server has closed the connection
            error.code === '42P05' || // Prepared statement already exists
            error.code === '08P01' || // Bind message parameter mismatch
            error.code === '08006' || // Connection failure
            error.code === '08003' || // Connection does not exist
            error.code === '08001'    // SQL client unable to establish SQL connection
          )
        ) || (
          typeof error === 'object' && error !== null && 'message' in error && (
            (error.message as string)?.includes('prepared statement') ||
            (error.message as string)?.includes('does not exist') ||
            (error.message as string)?.includes('already exists') ||
            (error.message as string)?.includes('connection') ||
            (error.message as string)?.includes('timeout') ||
            (error.message as string)?.includes('ECONNREFUSED') ||
            (error.message as string)?.includes('ENOTFOUND') ||
            (error.message as string)?.includes('ETIMEDOUT')
          )
        )

        if (isRetryableError && attempt < maxRetries) {
          const waitTime = delay * Math.pow(backoffMultiplier, attempt)
          const jitter = Math.random() * 1000 // Add jitter to prevent thundering herd
          const totalWaitTime = waitTime + jitter
          
          console.log(`🔄 Database error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(totalWaitTime)}ms...`, {
            error: lastError.message,
            code: 'code' in lastError ? lastError.code : 'unknown'
          })
          
          await new Promise(resolve => setTimeout(resolve, totalWaitTime))
          continue
        }

        // If it's not a retryable error or we've exhausted retries, throw immediately
        throw error
      }
    }

    throw lastError!
  })
}

// Enhanced helper function for database operations
export async function retryPrismaOperation<T>(
  operation: (database: typeof database) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return withRetry(() => operation(database), options)
}

// Health check function
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  details: any
  circuitBreaker: any
}> {
  try {
    const healthCheck = await database.healthCheck()
    const circuitState = circuitBreaker.getState()
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    
    if (healthCheck.status === 'unhealthy') {
      status = 'unhealthy'
    } else if (!circuitState.isHealthy) {
      status = 'degraded'
    }

    return {
      status,
      details: healthCheck,
      circuitBreaker: circuitState
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      details: { error: (error as Error).message },
      circuitBreaker: circuitBreaker.getState()
    }
  }
}

// Export circuit breaker for monitoring
export { circuitBreaker }