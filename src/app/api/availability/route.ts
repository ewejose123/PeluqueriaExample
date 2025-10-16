import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTimeSlots, isTimeSlotAvailable } from '@/lib/availability'
import { addDays, format, parseISO, startOfDay, addMinutes } from 'date-fns'

// GET /api/availability - Get available time slots for a service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')
    const employeeId = searchParams.get('employeeId') // Optional employee filter
    const businessSlug = searchParams.get('businessSlug') || 'sample-business'
    const totalDurationParam = searchParams.get('totalDuration')

    if (!serviceId || !date) {
      return NextResponse.json({ error: 'Missing serviceId or date' }, { status: 400 })
    }

    // Get service details
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        business: { slug: businessSlug },
        isActive: true 
      },
      include: {
        employees: {
          where: { 
            isActive: true,
            // Filter by specific employee if provided
            ...(employeeId && { id: employeeId })
          },
          include: {
            workingHours: {
              where: { isActive: true }
            },
            appointments: {
              where: {
                startTime: {
                  gte: startOfDay(parseISO(date))
                },
                endTime: {
                  lt: addDays(startOfDay(parseISO(date)), 1)
                },
                status: { not: 'cancelled' }
              }
            },
            timeBlocks: {
              where: {
                startTime: {
                  gte: startOfDay(parseISO(date))
                },
                endTime: {
                  lt: addDays(startOfDay(parseISO(date)), 1)
                }
              }
            }
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Use totalDuration if provided, otherwise use service duration
    const totalDuration = totalDurationParam ? parseInt(totalDurationParam, 10) : service.duration

    const selectedDate = parseISO(date)
    const dayOfWeek = selectedDate.getDay()

    // Generate available time slots for each employee
    const availableSlots: Array<{
        time: string
        datetime: string
        endTime: string
        employeeId: string
        employeeName: string
        serviceId: string
        serviceName: string
        duration: number
        price: number | null
    }> = []

    for (const employee of service.employees) {
      // Find working hours for this day
      const workingHour = employee.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
      
      if (!workingHour) continue

      // Generate time slots for this employee
      const slots = generateTimeSlots(
        workingHour.startTime,
        workingHour.endTime,
        totalDuration,
        employee.appointments.map(apt => ({
          startTime: apt.startTime,
          endTime: apt.endTime
        })),
        employee.timeBlocks.map(block => ({
          startTime: block.startTime,
          endTime: block.endTime
        })),
        selectedDate
      )

      // Add employee info to each slot
      slots.forEach(slot => {
        const endTime = addMinutes(slot, totalDuration)
        availableSlots.push({
          time: format(slot, 'HH:mm'),
          datetime: slot.toISOString(),
          endTime: endTime.toISOString(),
          employeeId: employee.id,
          employeeName: employee.name,
          serviceId: service.id,
          serviceName: service.name,
          duration: totalDuration,
          price: service.price
        })
      })
    }

    // Sort by time
    availableSlots.sort((a, b) => a.time.localeCompare(b.time))

    return NextResponse.json({ 
      availableSlots,
      service: {
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price
      }
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
