import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/dbRetry'

// GET /api/health - Database health check endpoint
export async function GET(request: NextRequest) {
  try {
    const health = await checkDatabaseHealth()
    
    const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503
    
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
      database: health.details,
      circuitBreaker: health.circuitBreaker,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }, { status: statusCode })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }, { status: 503 })
  }
}
