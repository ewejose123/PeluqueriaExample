import { PrismaClient } from '@prisma/client'

// Connection strategies for different scenarios
interface ConnectionConfig {
  url: string
  name: string
  timeout: number
  maxRetries: number
  retryDelay: number
}

// Multiple connection strategies for maximum reliability
const connectionStrategies: ConnectionConfig[] = [
  {
    name: 'Session Pooler (Primary)',
    url: process.env.DATABASE_URL || '',
    timeout: 60000,
    maxRetries: 3,
    retryDelay: 1000
  },
  {
    name: 'Direct Connection (Fallback)',
    url: process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL?.replace(':5432', ':5432').replace('pooler.', '') || '',
    timeout: 30000,
    maxRetries: 2,
    retryDelay: 2000
  },
  {
    name: 'Transaction Pooler (High Concurrency)',
    url: process.env.DATABASE_URL_TRANSACTION || '',
    timeout: 45000,
    maxRetries: 2,
    retryDelay: 1500
  }
]

// Enhanced Prisma client with connection management
class DatabaseManager {
  private clients: Map<string, PrismaClient> = new Map()
  private currentStrategy: string = 'Session Pooler (Primary)'
  private connectionAttempts: Map<string, number> = new Map()
  private lastSuccessfulConnection: string = 'Session Pooler (Primary)'

  constructor() {
    this.initializeConnections()
  }

  private initializeConnections() {
    connectionStrategies.forEach(strategy => {
      if (strategy.url) {
        try {
          const client = new PrismaClient({
            datasources: {
              db: {
                url: strategy.url
              }
            },
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
            errorFormat: 'pretty'
          })
          
          this.clients.set(strategy.name, client)
          this.connectionAttempts.set(strategy.name, 0)
          
          console.log(`✅ Initialized ${strategy.name} connection`)
        } catch (error) {
          console.error(`❌ Failed to initialize ${strategy.name}:`, error)
        }
      }
    })
  }

  // Get the most reliable client
  async getClient(): Promise<PrismaClient> {
    // Try current strategy first
    const currentClient = this.clients.get(this.currentStrategy)
    if (currentClient && await this.testConnection(currentClient)) {
      return currentClient
    }

    // Try last successful connection
    if (this.lastSuccessfulConnection !== this.currentStrategy) {
      const lastSuccessfulClient = this.clients.get(this.lastSuccessfulConnection)
      if (lastSuccessfulClient && await this.testConnection(lastSuccessfulClient)) {
        this.currentStrategy = this.lastSuccessfulConnection
        return lastSuccessfulClient
      }
    }

    // Try all strategies in order
    for (const strategy of connectionStrategies) {
      const client = this.clients.get(strategy.name)
      if (client && await this.testConnection(client)) {
        this.currentStrategy = strategy.name
        this.lastSuccessfulConnection = strategy.name
        console.log(`🔄 Switched to ${strategy.name} connection`)
        return client
      }
    }

    throw new Error('❌ All database connections failed')
  }

  // Test connection health
  private async testConnection(client: PrismaClient): Promise<boolean> {
    try {
      await client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.warn(`⚠️ Connection test failed:`, error)
      return false
    }
  }

  // Execute operation with automatic retry and fallback
  async execute<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
    const maxAttempts = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const client = await this.getClient()
        const result = await operation(client)
        
        // Reset connection attempts on success
        this.connectionAttempts.set(this.currentStrategy, 0)
        return result
      } catch (error) {
        lastError = error as Error
        console.error(`❌ Database operation failed (attempt ${attempt}/${maxAttempts}):`, error)
        
        // Increment failure count for current strategy
        const currentAttempts = this.connectionAttempts.get(this.currentStrategy) || 0
        this.connectionAttempts.set(this.currentStrategy, currentAttempts + 1)
        
        // If too many failures, try different strategy
        if (currentAttempts >= 2) {
          await this.switchToNextStrategy()
        }
        
        // Wait before retry
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000))
        }
      }
    }

    throw new Error(`Database operation failed after ${maxAttempts} attempts: ${lastError?.message}`)
  }

  // Switch to next available strategy
  private async switchToNextStrategy(): Promise<void> {
    const currentIndex = connectionStrategies.findIndex(s => s.name === this.currentStrategy)
    const nextIndex = (currentIndex + 1) % connectionStrategies.length
    this.currentStrategy = connectionStrategies[nextIndex].name
    console.log(`🔄 Switching to ${this.currentStrategy}`)
  }

  // Health check for monitoring
  async healthCheck(): Promise<{ status: string; connections: any[] }> {
    const connections = []
    
    for (const strategy of connectionStrategies) {
      const client = this.clients.get(strategy.name)
      if (client) {
        try {
          const start = Date.now()
          await client.$queryRaw`SELECT 1`
          const responseTime = Date.now() - start
          
          connections.push({
            name: strategy.name,
            status: 'healthy',
            responseTime: `${responseTime}ms`,
            attempts: this.connectionAttempts.get(strategy.name) || 0
          })
        } catch (error) {
          connections.push({
            name: strategy.name,
            status: 'unhealthy',
            error: (error as Error).message,
            attempts: this.connectionAttempts.get(strategy.name) || 0
          })
        }
      }
    }

    const healthyConnections = connections.filter(c => c.status === 'healthy')
    const status = healthyConnections.length > 0 ? 'healthy' : 'unhealthy'

    return { status, connections }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.values()).map(client => 
      client.$disconnect().catch(error => 
        console.error('Error disconnecting client:', error)
      )
    )
    
    await Promise.all(disconnectPromises)
    this.clients.clear()
    console.log('🔌 All database connections closed')
  }
}

// Global instance
const globalForDatabase = globalThis as unknown as {
  database: DatabaseManager | undefined
}

export const database = globalForDatabase.database ?? new DatabaseManager()

if (process.env.NODE_ENV !== 'production') {
  globalForDatabase.database = database
}

// Export Prisma client for backward compatibility
export const prisma = {
  async $executeRaw(query: any) {
    return database.execute(client => client.$executeRaw(query))
  },
  async $queryRaw(query: any) {
    return database.execute(client => client.$queryRaw(query))
  },
  async $transaction(operations: any) {
    return database.execute(client => client.$transaction(operations))
  },
  // Proxy all other operations
  get business() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.business as any)[prop](...args))
        }
      }
    })
  },
  get employee() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.employee as any)[prop](...args))
        }
      }
    })
  },
  get service() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.service as any)[prop](...args))
        }
      }
    })
  },
  get appointment() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.appointment as any)[prop](...args))
        }
      }
    })
  },
  get bookingSettings() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.bookingSettings as any)[prop](...args))
        }
      }
    })
  },
  get workingHours() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.workingHours as any)[prop](...args))
        }
      }
    })
  },
  get timeBlock() {
    return new Proxy({}, {
      get(target, prop) {
        return async (...args: any[]) => {
          return database.execute(client => (client.timeBlock as any)[prop](...args))
        }
      }
    })
  }
}

export default database
