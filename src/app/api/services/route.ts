import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/simplePrisma'

// GET /api/services - Get all services for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    console.log('Fetching services for business:', businessSlug)

    // Get business first
    const business = await db.business.findUnique({
      where: { slug: businessSlug }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    console.log('Business found:', business.name)

    // Get services
    const services = await db.service.findMany({
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

    console.log('Services found:', services.length)

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    
    // Enhanced error response with more context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : 'UNKNOWN'
    
    return NextResponse.json({ 
      error: 'Failed to fetch services',
      details: errorMessage,
      code: errorCode,
      suggestion: 'Please try again or contact support if the issue persists'
    }, { status: 500 })
  }
}