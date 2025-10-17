import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/simplePrisma'

// GET /api/employees - Get all employees for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    console.log('Fetching employees for business:', businessSlug)

    // Get business first
    const business = await db.business.findUnique({
      where: { slug: businessSlug }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    console.log('Business found:', business.name)

    // Get employees
    const employees = await db.employee.findMany({
      where: {
        businessId: business.id,
        isActive: true
      },
      include: {
        services: {
          where: { isActive: true }
        },
        workingHours: {
          where: { isActive: true }
        }
      }
    })

    console.log('Employees found:', employees.length)

    return NextResponse.json({ employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    
    // Enhanced error response with more context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : 'UNKNOWN'
    
    return NextResponse.json({ 
      error: 'Failed to fetch employees',
      details: errorMessage,
      code: errorCode,
      suggestion: 'Please try again or contact support if the issue persists'
    }, { status: 500 })
  }
}