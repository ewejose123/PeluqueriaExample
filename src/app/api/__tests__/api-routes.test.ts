import { NextRequest } from 'next/server'
import { GET as getEmployees } from '@/app/api/employees/route'
import { GET as getServices } from '@/app/api/services/route'
import { GET as getAppointments } from '@/app/api/appointments/route'
import { GET as getBookingSettings } from '@/app/api/booking-settings/route'

// Mock the database
jest.mock('@/lib/simplePrisma', () => ({
  db: {
    business: {
      findUnique: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
    },
    bookingSettings: {
      create: jest.fn(),
    },
  },
}))

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('/api/employees', () => {
    it('should return employees for valid business slug', async () => {
      const mockBusiness = { id: 'business-1', name: 'Test Business' }
      const mockEmployees = [
        { id: 'emp-1', name: 'John Doe', email: 'john@test.com' },
        { id: 'emp-2', name: 'Jane Smith', email: 'jane@test.com' },
      ]

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)
      db.employee.findMany.mockResolvedValue(mockEmployees)

      const request = new NextRequest('http://localhost:3000/api/employees?businessSlug=sample-business')
      const response = await getEmployees(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.employees).toEqual(mockEmployees)
      expect(db.business.findUnique).toHaveBeenCalledWith({
        where: { slug: 'sample-business' },
      })
      expect(db.employee.findMany).toHaveBeenCalledWith({
        where: { businessId: 'business-1', isActive: true },
        include: {
          services: {
            where: { isActive: true },
          },
          workingHours: {
            where: { isActive: true },
          },
        },
      })
    })

    it('should return 404 for invalid business slug', async () => {
      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/employees?businessSlug=invalid')
      const response = await getEmployees(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Business not found')
    })

    it('should use default business slug when not provided', async () => {
      const mockBusiness = { id: 'business-1', name: 'Sample Business' }
      const mockEmployees = []

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)
      db.employee.findMany.mockResolvedValue(mockEmployees)

      const request = new NextRequest('http://localhost:3000/api/employees')
      const response = await getEmployees(request)

      expect(response.status).toBe(200)
      expect(db.business.findUnique).toHaveBeenCalledWith({
        where: { slug: 'sample-business' },
      })
    })
  })

  describe('/api/services', () => {
    it('should return services for valid business slug', async () => {
      const mockBusiness = { id: 'business-1', name: 'Test Business' }
      const mockServices = [
        { id: 'svc-1', name: 'Haircut', duration: 30, price: 25.00 },
        { id: 'svc-2', name: 'Beard Trim', duration: 20, price: 15.00 },
      ]

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)
      db.service.findMany.mockResolvedValue(mockServices)

      const request = new NextRequest('http://localhost:3000/api/services?businessSlug=sample-business')
      const response = await getServices(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.services).toEqual(mockServices)
      expect(db.business.findUnique).toHaveBeenCalledWith({
        where: { slug: 'sample-business' },
      })
      expect(db.service.findMany).toHaveBeenCalledWith({
        where: { businessId: 'business-1', isActive: true },
        include: {
          employees: {
            where: { isActive: true },
          },
        },
      })
    })

    it('should return 404 for invalid business slug', async () => {
      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/services?businessSlug=invalid')
      const response = await getServices(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Business not found')
    })
  })

  describe('/api/appointments', () => {
    it('should return appointments for valid business slug', async () => {
      const mockBusiness = { id: 'business-1', name: 'Test Business' }
      const mockAppointments = [
        {
          id: 'apt-1',
          startTime: '2024-01-01T10:00:00.000Z',
          endTime: '2024-01-01T10:30:00.000Z',
          customerName: 'Test Customer',
          status: 'confirmed',
        },
      ]

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)
      db.appointment.findMany.mockResolvedValue(mockAppointments)

      const request = new NextRequest('http://localhost:3000/api/appointments?businessSlug=sample-business')
      const response = await getAppointments(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.appointments).toEqual(mockAppointments)
      expect(db.business.findUnique).toHaveBeenCalledWith({
        where: { slug: 'sample-business' },
      })
      expect(db.appointment.findMany).toHaveBeenCalledWith({
        where: { businessId: 'business-1' },
        include: {
          service: true,
          employee: true,
        },
        orderBy: { startTime: 'asc' },
      })
    })
  })

  describe('/api/booking-settings', () => {
    it('should return existing booking settings', async () => {
      const mockBusiness = { 
        id: 'business-1', 
        name: 'Test Business',
        bookingSettings: {
          id: 'settings-1',
          advanceBookingDays: 30,
          slotDuration: 30,
        }
      }

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)

      const request = new NextRequest('http://localhost:3000/api/booking-settings?businessSlug=sample-business')
      const response = await getBookingSettings(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.settings).toEqual(mockBusiness.bookingSettings)
    })

    it('should create default booking settings if none exist', async () => {
      const mockBusiness = { 
        id: 'business-1', 
        name: 'Test Business',
        bookingSettings: null
      }
      const mockSettings = {
        id: 'settings-new',
        businessId: 'business-1',
        advanceBookingDays: 30,
        slotDuration: 30,
      }

      const { db } = require('@/lib/simplePrisma')
      db.business.findUnique.mockResolvedValue(mockBusiness)
      db.bookingSettings.create.mockResolvedValue(mockSettings)

      const request = new NextRequest('http://localhost:3000/api/booking-settings?businessSlug=sample-business')
      const response = await getBookingSettings(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.settings).toEqual(mockSettings)
      expect(db.bookingSettings.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          businessId: 'business-1',
          advanceBookingDays: 30,
          slotDuration: 30,
        }),
      })
    })
  })
})
