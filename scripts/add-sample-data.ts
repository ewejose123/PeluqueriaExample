import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSampleData() {
  try {
    console.log('🌱 Adding sample data...')

    // Create a sample business
    const business = await prisma.business.upsert({
      where: { slug: 'sample-business' },
      update: {},
      create: {
        name: 'Barbería Elite',
        slug: 'sample-business',
        address: 'Calle Sta. Eulalia, 8A, 30850 Totana, Murcia',
        phone: '+34 968 123 456',
        email: 'info@barberiaelite.com',
        description: 'Barbería de lujo en el corazón de Totana',
        primaryColor: '#F59E0B',
        secondaryColor: '#1F2937',
        timezone: 'Europe/Madrid',
        currency: 'EUR',
        userId: 'sample-user-id'
      }
    })

    console.log('✅ Business created:', business.name)

    // Create booking settings
    await prisma.bookingSettings.upsert({
      where: { businessId: business.id },
      update: {},
      create: {
        businessId: business.id,
        advanceBookingDays: 30,
        minBookingHours: 2,
        maxBookingHours: 24,
        slotDuration: 30,
        bufferTime: 15,
        allowSameDay: true,
        requireConfirmation: false,
        cancellationHours: 24,
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

    console.log('✅ Booking settings created')

    // Create employees
    const employees = await Promise.all([
      prisma.employee.upsert({
        where: { id: 'employee-1' },
        update: {},
        create: {
          id: 'employee-1',
          name: 'Carlos Martínez',
          email: 'carlos@barberiaelite.com',
          phone: '+34 968 123 457',
          businessId: business.id,
          isActive: true
        }
      }),
      prisma.employee.upsert({
        where: { id: 'employee-2' },
        update: {},
        create: {
          id: 'employee-2',
          name: 'Miguel Rodríguez',
          email: 'miguel@barberiaelite.com',
          phone: '+34 968 123 458',
          businessId: business.id,
          isActive: true
        }
      })
    ])

    console.log('✅ Employees created:', employees.length)

    // Create services
    const services = await Promise.all([
      prisma.service.upsert({
        where: { id: 'service-1' },
        update: {},
        create: {
          id: 'service-1',
          name: 'Corte Clásico',
          description: 'Corte de cabello tradicional con tijeras y máquina',
          duration: 30,
          price: 15.00,
          category: 'Cortes',
          businessId: business.id,
          isActive: true
        }
      }),
      prisma.service.upsert({
        where: { id: 'service-2' },
        update: {},
        create: {
          id: 'service-2',
          name: 'Corte + Barba',
          description: 'Corte de cabello completo con arreglo de barba',
          duration: 45,
          price: 25.00,
          category: 'Cortes',
          businessId: business.id,
          isActive: true
        }
      }),
      prisma.service.upsert({
        where: { id: 'service-3' },
        update: {},
        create: {
          id: 'service-3',
          name: 'Arreglo de Barba',
          description: 'Arreglo completo de barba con navaja',
          duration: 20,
          price: 12.00,
          category: 'Barba',
          businessId: business.id,
          isActive: true
        }
      }),
      prisma.service.upsert({
        where: { id: 'service-4' },
        update: {},
        create: {
          id: 'service-4',
          name: 'Corte Premium',
          description: 'Corte de cabello premium con lavado y peinado',
          duration: 60,
          price: 35.00,
          category: 'Premium',
          businessId: business.id,
          isActive: true
        }
      })
    ])

    console.log('✅ Services created:', services.length)

    // Create employee-service relationships
    await prisma.employee.update({
      where: { id: employees[0].id },
      data: {
        services: {
          connect: services.map(s => ({ id: s.id }))
        }
      }
    })

    await prisma.employee.update({
      where: { id: employees[1].id },
      data: {
        services: {
          connect: services.map(s => ({ id: s.id }))
        }
      }
    })

    console.log('✅ Employee-service relationships created')

    // Create working hours for employees
    for (const employee of employees) {
      for (let day = 1; day <= 6; day++) { // Monday to Saturday
        await prisma.workingHours.upsert({
          where: { 
            employeeId_dayOfWeek: {
              employeeId: employee.id,
              dayOfWeek: day
            }
          },
          update: {},
          create: {
            employeeId: employee.id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '19:00',
            isActive: true
          }
        })
      }
    }
    console.log('✅ Working hours created')

    console.log('🎉 Sample data added successfully!')
  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleData()
