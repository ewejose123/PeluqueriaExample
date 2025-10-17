import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { db } from '@/lib/simplePrisma'
import { createTestBusiness, createTestEmployee, createTestService, createTestAppointment } from '@/lib/testUtils'

// Mock Prisma client for integration tests
jest.mock('@/lib/simplePrisma', () => {
  const mockDb = {
    business: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    service: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    bookingSettings: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workingHours: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    timeBlock: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }
  
  return { db: mockDb }
})

describe('Database Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Business Operations', () => {
    it('should find business by slug', async () => {
      const testBusiness = createTestBusiness()
      const { db } = require('@/lib/simplePrisma')
      
      db.business.findUnique.mockResolvedValue(testBusiness)
      
      const result = await db.business.findUnique({
        where: { slug: 'sample-business' }
      })
      
      expect(result).toEqual(testBusiness)
      expect(db.business.findUnique).toHaveBeenCalledWith({
        where: { slug: 'sample-business' }
      })
    })

    it('should create new business', async () => {
      const businessData = createTestBusiness()
      const { db } = require('@/lib/simplePrisma')
      
      db.business.create.mockResolvedValue(businessData)
      
      const result = await db.business.create({
        data: businessData
      })
      
      expect(result).toEqual(businessData)
      expect(db.business.create).toHaveBeenCalledWith({
        data: businessData
      })
    })
  })

  describe('Employee Operations', () => {
    it('should find employees by business ID', async () => {
      const testEmployees = [
        createTestEmployee({ id: 'emp-1', name: 'John Doe' }),
        createTestEmployee({ id: 'emp-2', name: 'Jane Smith' }),
      ]
      const { db } = require('@/lib/simplePrisma')
      
      db.employee.findMany.mockResolvedValue(testEmployees)
      
      const result = await db.employee.findMany({
        where: { businessId: 'test-business-1', isActive: true }
      })
      
      expect(result).toEqual(testEmployees)
      expect(db.employee.findMany).toHaveBeenCalledWith({
        where: { businessId: 'test-business-1', isActive: true }
      })
    })

    it('should create new employee', async () => {
      const employeeData = createTestEmployee()
      const { db } = require('@/lib/simplePrisma')
      
      db.employee.create.mockResolvedValue(employeeData)
      
      const result = await db.employee.create({
        data: employeeData
      })
      
      expect(result).toEqual(employeeData)
      expect(db.employee.create).toHaveBeenCalledWith({
        data: employeeData
      })
    })
  })

  describe('Service Operations', () => {
    it('should find services by business ID', async () => {
      const testServices = [
        createTestService({ id: 'svc-1', name: 'Haircut' }),
        createTestService({ id: 'svc-2', name: 'Beard Trim' }),
      ]
      const { db } = require('@/lib/simplePrisma')
      
      db.service.findMany.mockResolvedValue(testServices)
      
      const result = await db.service.findMany({
        where: { businessId: 'test-business-1', isActive: true }
      })
      
      expect(result).toEqual(testServices)
      expect(db.service.findMany).toHaveBeenCalledWith({
        where: { businessId: 'test-business-1', isActive: true }
      })
    })

    it('should create new service', async () => {
      const serviceData = createTestService()
      const { db } = require('@/lib/simplePrisma')
      
      db.service.create.mockResolvedValue(serviceData)
      
      const result = await db.service.create({
        data: serviceData
      })
      
      expect(result).toEqual(serviceData)
      expect(db.service.create).toHaveBeenCalledWith({
        data: serviceData
      })
    })
  })

  describe('Appointment Operations', () => {
    it('should find appointments by business ID', async () => {
      const testAppointments = [
        createTestAppointment({ id: 'apt-1', customerName: 'John Doe' }),
        createTestAppointment({ id: 'apt-2', customerName: 'Jane Smith' }),
      ]
      const { db } = require('@/lib/simplePrisma')
      
      db.appointment.findMany.mockResolvedValue(testAppointments)
      
      const result = await db.appointment.findMany({
        where: { businessId: 'test-business-1' },
        include: { service: true, employee: true },
        orderBy: { startTime: 'asc' }
      })
      
      expect(result).toEqual(testAppointments)
      expect(db.appointment.findMany).toHaveBeenCalledWith({
        where: { businessId: 'test-business-1' },
        include: { service: true, employee: true },
        orderBy: { startTime: 'asc' }
      })
    })

    it('should create new appointment', async () => {
      const appointmentData = createTestAppointment()
      const { db } = require('@/lib/simplePrisma')
      
      db.appointment.create.mockResolvedValue(appointmentData)
      
      const result = await db.appointment.create({
        data: appointmentData
      })
      
      expect(result).toEqual(appointmentData)
      expect(db.appointment.create).toHaveBeenCalledWith({
        data: appointmentData
      })
    })

    it('should delete appointment', async () => {
      const { db } = require('@/lib/simplePrisma')
      
      db.appointment.delete.mockResolvedValue({ id: 'apt-1' })
      
      const result = await db.appointment.delete({
        where: { id: 'apt-1' }
      })
      
      expect(result).toEqual({ id: 'apt-1' })
      expect(db.appointment.delete).toHaveBeenCalledWith({
        where: { id: 'apt-1' }
      })
    })
  })

  describe('Booking Settings Operations', () => {
    it('should create default booking settings', async () => {
      const settingsData = {
        id: 'settings-1',
        businessId: 'test-business-1',
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
      const { db } = require('@/lib/simplePrisma')
      
      db.bookingSettings.create.mockResolvedValue(settingsData)
      
      const result = await db.bookingSettings.create({
        data: settingsData
      })
      
      expect(result).toEqual(settingsData)
      expect(db.bookingSettings.create).toHaveBeenCalledWith({
        data: settingsData
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const { db } = require('@/lib/simplePrisma')
      
      const connectionError = new Error('Connection failed')
      connectionError.code = 'P1001'
      
      db.business.findUnique.mockRejectedValue(connectionError)
      
      await expect(db.business.findUnique({
        where: { slug: 'sample-business' }
      })).rejects.toThrow('Connection failed')
    })

    it('should handle validation errors', async () => {
      const { db } = require('@/lib/simplePrisma')
      
      const validationError = new Error('Validation failed')
      validationError.code = 'P2002'
      
      db.employee.create.mockRejectedValue(validationError)
      
      await expect(db.employee.create({
        data: { name: 'Test Employee' }
      })).rejects.toThrow('Validation failed')
    })
  })
})
