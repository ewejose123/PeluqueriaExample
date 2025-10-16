import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/employees - Get all employees for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      include: {
        employees: {
          where: { isActive: true },
          include: {
            services: {
              where: { isActive: true }
            },
            workingHours: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({ employees: business.employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
