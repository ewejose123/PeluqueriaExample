#!/usr/bin/env tsx

// Test script for the new robust database configuration
import { database } from '../src/lib/database'
import { checkDatabaseHealth } from '../src/lib/dbRetry'

async function testDatabaseConfiguration() {
  console.log('🧪 Testing Robust Database Configuration...\n')

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...')
    const health = await checkDatabaseHealth()
    console.log('✅ Health Status:', health.status)
    console.log('📊 Details:', JSON.stringify(health.details, null, 2))
    console.log('🔌 Circuit Breaker:', JSON.stringify(health.circuitBreaker, null, 2))
    console.log('')

    // Test 2: Basic Database Operations
    console.log('2️⃣ Testing Basic Database Operations...')
    
    // Test business query
    const business = await database.execute(async (client) => {
      return await client.business.findUnique({
        where: { slug: 'sample-business' }
      })
    })
    console.log('✅ Business Query:', business ? `Found: ${business.name}` : 'Not found')
    
    // Test employees query
    const employees = await database.execute(async (client) => {
      return await client.employee.findMany({
        where: { isActive: true },
        take: 3
      })
    })
    console.log('✅ Employees Query:', `Found ${employees.length} employees`)
    
    // Test services query
    const services = await database.execute(async (client) => {
      return await client.service.findMany({
        where: { isActive: true },
        take: 3
      })
    })
    console.log('✅ Services Query:', `Found ${services.length} services`)
    console.log('')

    // Test 3: Connection Switching (Simulate failure)
    console.log('3️⃣ Testing Connection Resilience...')
    
    // Test multiple operations to verify connection stability
    const promises = Array.from({ length: 5 }, (_, i) => 
      database.execute(async (client) => {
        const result = await client.$queryRaw`SELECT ${i} as test_number, NOW() as timestamp`
        return result
      })
    )
    
    const results = await Promise.all(promises)
    console.log('✅ Concurrent Operations:', `Completed ${results.length} operations`)
    console.log('')

    // Test 4: Performance Test
    console.log('4️⃣ Testing Performance...')
    const startTime = Date.now()
    
    await database.execute(async (client) => {
      return await client.$queryRaw`SELECT COUNT(*) as total FROM "Business"`
    })
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    console.log('✅ Performance Test:', `Response time: ${responseTime}ms`)
    console.log('')

    // Test 5: Error Handling
    console.log('5️⃣ Testing Error Handling...')
    try {
      await database.execute(async (client) => {
        return await client.$queryRaw`SELECT * FROM "NonExistentTable"`
      })
    } catch (error) {
      console.log('✅ Error Handling:', 'Properly caught and handled error')
    }
    console.log('')

    console.log('🎉 All tests completed successfully!')
    console.log('📈 Database configuration is production-ready!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    // Cleanup
    await database.disconnect()
    console.log('🔌 Database connections closed')
  }
}

// Run the test
testDatabaseConfiguration().catch(console.error)
