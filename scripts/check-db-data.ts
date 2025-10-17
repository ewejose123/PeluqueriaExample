import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking database data...')
    
    // Check business
    const business = await prisma.business.findUnique({
      where: { slug: 'sample-business' },
      include: {
        employees: true,
        services: true,
        bookingSettings: true
      }
    })
    
    console.log('Business:', business ? 'Found' : 'Not found')
    if (business) {
      console.log('Business name:', business.name)
      console.log('Employees count:', business.employees.length)
      console.log('Services count:', business.services.length)
      console.log('Booking settings:', business.bookingSettings ? 'Found' : 'Not found')
    }
    
    // Check employees directly
    const employees = await prisma.employee.findMany({
      where: { business: { slug: 'sample-business' } }
    })
    console.log('Direct employees query count:', employees.length)
    
    // Check services directly
    const services = await prisma.service.findMany({
      where: { business: { slug: 'sample-business' } }
    })
    console.log('Direct services query count:', services.length)
    
  } catch (error) {
    console.error('Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
