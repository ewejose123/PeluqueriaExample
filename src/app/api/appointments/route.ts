import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/simplePrisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching appointments...')
    
    const { searchParams } = new URL(request.url)
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'
    
    // Get business first
    const business = await db.business.findUnique({
      where: { slug: businessSlug }
    })
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
    const appointments = await db.appointment.findMany({
      where: { businessId: business.id },
      include: {
        service: true,
        employee: true
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    console.log('Appointments found:', appointments.length)

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    
    // Enhanced error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : 'UNKNOWN'
    
    return NextResponse.json({ 
      error: 'Failed to fetch appointments',
      details: errorMessage,
      code: errorCode,
      suggestion: 'Please try again or contact support if the issue persists'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startTime, endTime, clientName, clientEmail, clientPhone, serviceId, employeeId, businessSlug } = body

    // Validate dates
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Get business ID
    const business = await db.business.findUnique({
      where: { slug: businessSlug || 'sample-business' }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const appointment = await db.appointment.create({
      data: {
        startTime: startDate,
        endTime: endDate,
        clientName,
        clientEmail,
        clientPhone,
        serviceId,
        employeeId,
        businessId: business.id
      },
      include: {
        service: true,
        employee: true
      }
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    // First check if the appointment exists
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await db.appointment.delete({
      where: { id: appointmentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}