import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create business (generic, not barber shop specific)
  const business = await prisma.business.create({
    data: {
      name: 'Sample Business',
      slug: 'sample-business',
      address: '123 Main Street, City, Country',
      phone: '+1 234 567 8900',
      email: 'info@samplebusiness.com',
      website: 'https://samplebusiness.com',
      description: 'A general service business with appointment booking.',
      primaryColor: '#F59E0B',
      secondaryColor: '#1F2937',
      timezone: 'Europe/Madrid',
      currency: 'EUR',
      userId: 'temp-user-id', // This will be replaced when auth is implemented
    },
  })

  console.log('✅ Created business:', business.name)

  // Create booking settings
  const bookingSettings = await prisma.bookingSettings.create({
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
        "6": true,  // Saturday
      },
      breakTimes: [
        { start: "12:00", end: "13:00" }
      ],
    },
  })

  console.log('✅ Created booking settings')

  // Create employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'John Smith',
        email: 'john@samplebusiness.com',
        phone: '+1 234 567 8901',
        businessId: business.id,
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@samplebusiness.com',
        phone: '+1 234 567 8902',
        businessId: business.id,
        isActive: true,
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Mike Wilson',
        email: 'mike@samplebusiness.com',
        phone: '+1 234 567 8903',
        businessId: business.id,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created employees:', employees.map(e => e.name))

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Basic Service',
        description: 'A basic service offering.',
        duration: 30,
        price: 25.00,
        category: 'Standard',
        businessId: business.id,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Premium Service',
        description: 'A premium service with additional features.',
        duration: 60,
        price: 50.00,
        category: 'Premium',
        businessId: business.id,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Quick Service',
        description: 'A quick service for busy clients.',
        duration: 15,
        price: 15.00,
        category: 'Express',
        businessId: business.id,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Extended Service',
        description: 'An extended service with comprehensive features.',
        duration: 90,
        price: 75.00,
        category: 'Extended',
        businessId: business.id,
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created services:', services.map(s => s.name))

  // Assign services to employees (many-to-many relationship)
  // John can do Basic and Premium services
  await prisma.service.update({
    where: { id: services[0].id }, // Basic Service
    data: {
      employees: {
        connect: [{ id: employees[0].id }, { id: employees[1].id }], // John and Sarah
      },
    },
  })

  await prisma.service.update({
    where: { id: services[1].id }, // Premium Service
    data: {
      employees: {
        connect: [{ id: employees[0].id }], // Only John
      },
    },
  })

  // Sarah can do Basic and Quick services
  await prisma.service.update({
    where: { id: services[2].id }, // Quick Service
    data: {
      employees: {
        connect: [{ id: employees[1].id }, { id: employees[2].id }], // Sarah and Mike
      },
    },
  })

  // Mike can do Quick and Extended services
  await prisma.service.update({
    where: { id: services[3].id }, // Extended Service
    data: {
      employees: {
        connect: [{ id: employees[2].id }], // Only Mike
      },
    },
  })

  console.log('✅ Assigned services to employees')

  // Create working hours for employees
  const workingHoursData = []
  for (const employee of employees) {
    // Monday to Friday: 9:00 - 18:00
    for (let day = 1; day <= 5; day++) {
      workingHoursData.push({
        employeeId: employee.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true,
      })
    }
    // Saturday: 9:00 - 16:00
    workingHoursData.push({
      employeeId: employee.id,
      dayOfWeek: 6,
      startTime: '09:00',
      endTime: '16:00',
      isActive: true,
    })
  }

  await prisma.workingHours.createMany({
    data: workingHoursData,
  })

  console.log('✅ Created working hours for employees')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Summary:')
  console.log(`- Business: ${business.name}`)
  console.log(`- Employees: ${employees.length} (${employees.map(e => e.name).join(', ')})`)
  console.log(`- Services: ${services.length} (${services.map(s => s.name).join(', ')})`)
  console.log('\n🔗 Service-Employee Assignments:')
  console.log('- John Smith: Basic Service, Premium Service')
  console.log('- Sarah Johnson: Basic Service, Quick Service')
  console.log('- Mike Wilson: Quick Service, Extended Service')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
