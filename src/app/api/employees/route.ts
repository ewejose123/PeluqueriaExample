import { NextRequest, NextResponse } from 'next/server'
import { retryPrismaOperation } from '@/lib/dbRetry'

// GET /api/employees - Get all employees for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    console.log('Fetching employees for business:', businessSlug)

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

    // Then get employees separately with retry
    const employees = await retryPrismaOperation(async (prisma) => {
      return await prisma.employee.findMany({
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
    })

    console.log('Employees found:', employees.length)

    return NextResponse.json({ employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}