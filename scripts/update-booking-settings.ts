import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBookingSettings() {
  try {
    console.log('🔄 Updating booking settings...')
    
    const business = await prisma.business.findUnique({
      where: { slug: 'sample-business' }
    })
    
    if (!business) {
      console.log('❌ Business not found')
      return
    }
    
    const updatedSettings = await prisma.bookingSettings.upsert({
      where: { businessId: business.id },
      update: {
        maxAdvanceDays: 90
      },
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
    
    console.log('✅ Booking settings updated:', updatedSettings)
  } catch (error) {
    console.error('❌ Error updating booking settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBookingSettings()
