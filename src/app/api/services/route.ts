import { NextRequest, NextResponse } from 'next/server'
import { retryPrismaOperation } from '@/lib/dbRetry'

// GET /api/services - Get all services for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    console.log('Fetching services for business:', businessSlug)

    // Use retry mechanism for database operations
    const business = await retryPrismaOperation(async (prisma) => {
      return await prisma.business.findUnique({
        where: { slug: businessSlug }
      })
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    console.log('Business found:', business.name)

    // Then get services separately with retry
    const services = await retryPrismaOperation(async (prisma) => {
      return await prisma.service.findMany({
        where: { 
          businessId: business.id,
          isActive: true 
        },
        include: {
          employees: {
            where: { isActive: true }
          }
        }
      })
    })

    console.log('Services found:', services.length)

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}