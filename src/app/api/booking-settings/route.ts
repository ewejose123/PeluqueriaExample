import { NextRequest, NextResponse } from 'next/server'
import { retryPrismaOperation } from '@/lib/dbRetry'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'

    // Get business by slug with robust connection
    const business = await retryPrismaOperation(async (prisma) => {
      return await prisma.business.findUnique({
        where: { slug: businessSlug },
        include: {
          bookingSettings: true
        }
      })
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // If no booking settings exist, create default ones
    let settings = business.bookingSettings
    if (!settings) {
      settings = await retryPrismaOperation(async (prisma) => {
        return await prisma.bookingSettings.create({
          data: {
            businessId: business.id,
            advanceBookingDays: 30,
            minBookingHours: 2,
            maxBookingHours: 24,
            slotDuration: 30,
            bufferTime: 15,
            allowSameDay: true,
            requireConfirmation: false,
            cancellationHours: 24,
            maxAdvanceDays: 90,
            workingDays: {
              "0": false, // Sunday
              "1": true,  // Monday
              "2": true,  // Tuesday
              "3": true,  // Wednesday
              "4": true,  // Thursday
              "5": true,  // Friday
              "6": true   // Saturday
            }
          }
        })
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching booking settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'
    const body = await request.json()

    // Get business by slug with retry
    const business = await retryPrismaOperation(async (prisma) => {
      return await prisma.business.findUnique({
        where: { slug: businessSlug }
      })
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Update or create booking settings with retry
    const settings = await retryPrismaOperation(async (prisma) => {
      return await prisma.bookingSettings.upsert({
        where: { businessId: business.id },
        update: body,
        create: {
          businessId: business.id,
          ...body
        }
      })
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error updating booking settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
