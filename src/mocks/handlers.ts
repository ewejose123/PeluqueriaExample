import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API handlers
export const handlers = [
  // Mock employees API
  http.get('/api/employees', ({ request }) => {
    const url = new URL(request.url)
    const businessSlug = url.searchParams.get('businessSlug')
    
    if (businessSlug === 'sample-business') {
      return HttpResponse.json({
        employees: [
          {
            id: 'employee-1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            isActive: true,
            businessId: 'business-1',
          },
          {
            id: 'employee-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1234567891',
            isActive: true,
            businessId: 'business-1',
          },
        ],
      })
    }
    
    return HttpResponse.json({ error: 'Business not found' }, { status: 404 })
  }),

  // Mock services API
  http.get('/api/services', ({ request }) => {
    const url = new URL(request.url)
    const businessSlug = url.searchParams.get('businessSlug')
    
    if (businessSlug === 'sample-business') {
      return HttpResponse.json({
        services: [
          {
            id: 'service-1',
            name: 'Haircut',
            description: 'Professional haircut',
            duration: 30,
            price: 25.00,
            isActive: true,
            businessId: 'business-1',
          },
          {
            id: 'service-2',
            name: 'Beard Trim',
            description: 'Professional beard trimming',
            duration: 20,
            price: 15.00,
            isActive: true,
            businessId: 'business-1',
          },
        ],
      })
    }
    
    return HttpResponse.json({ error: 'Business not found' }, { status: 404 })
  }),

  // Mock appointments API
  http.get('/api/appointments', ({ request }) => {
    const url = new URL(request.url)
    const businessSlug = url.searchParams.get('businessSlug')
    
    if (businessSlug === 'sample-business') {
      return HttpResponse.json({
        appointments: [
          {
            id: 'appointment-1',
            startTime: '2024-01-01T10:00:00Z',
            endTime: '2024-01-01T10:30:00Z',
            status: 'confirmed',
            customerName: 'Test Customer',
            customerEmail: 'customer@example.com',
            customerPhone: '+1234567890',
            serviceId: 'service-1',
            employeeId: 'employee-1',
            businessId: 'business-1',
          },
        ],
      })
    }
    
    return HttpResponse.json({ error: 'Business not found' }, { status: 404 })
  }),

  // Mock booking settings API
  http.get('/api/booking-settings', ({ request }) => {
    const url = new URL(request.url)
    const businessSlug = url.searchParams.get('businessSlug')
    
    if (businessSlug === 'sample-business') {
      return HttpResponse.json({
        settings: {
          id: 'settings-1',
          businessId: 'business-1',
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
          },
        },
      })
    }
    
    return HttpResponse.json({ error: 'Business not found' }, { status: 404 })
  }),

  // Mock availability API
  http.get('/api/availability', ({ request }) => {
    const url = new URL(request.url)
    const serviceId = url.searchParams.get('serviceId')
    const date = url.searchParams.get('date')
    
    if (serviceId && date) {
      return HttpResponse.json({
        availableSlots: [
          {
            time: '09:00',
            datetime: '2024-01-01T09:00:00Z',
            endTime: '2024-01-01T09:30:00Z',
            employeeId: 'employee-1',
            employeeName: 'John Doe',
            serviceId: 'service-1',
            serviceName: 'Haircut',
            duration: 30,
            price: 25.00,
          },
          {
            time: '09:30',
            datetime: '2024-01-01T09:30:00Z',
            endTime: '2024-01-01T10:00:00Z',
            employeeId: 'employee-1',
            employeeName: 'John Doe',
            serviceId: 'service-1',
            serviceName: 'Haircut',
            duration: 30,
            price: 25.00,
          },
        ],
        service: {
          id: 'service-1',
          name: 'Haircut',
          duration: 30,
          price: 25.00,
        },
      })
    }
    
    return HttpResponse.json({ error: 'Missing serviceId or date' }, { status: 400 })
  }),

  // Mock appointment creation
  http.post('/api/appointments', async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json({
      appointment: {
        id: 'appointment-new',
        ...body,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }, { status: 201 })
  }),
]

// Setup MSW server
export const server = setupServer(...handlers)
