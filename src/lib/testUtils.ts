// Test database configuration
export const testDatabaseConfig = {
  // Use a separate test database
  url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL?.replace('postgres', 'postgres-test') || 'postgresql://test:test@localhost:5432/test_db',
  
  // Test-specific settings
  settings: {
    // Disable foreign key checks for faster test setup/teardown
    foreignKeyChecks: false,
    // Use transactions for test isolation
    useTransactions: true,
  }
}

// Test data factories
export const createTestBusiness = (overrides = {}) => ({
  id: 'test-business-1',
  name: 'Test Business',
  slug: 'test-business',
  description: 'Test business description',
  address: 'Test Address',
  phone: '+1234567890',
  email: 'test@business.com',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createTestEmployee = (overrides = {}) => ({
  id: 'test-employee-1',
  name: 'Test Employee',
  email: 'employee@test.com',
  phone: '+1234567890',
  isActive: true,
  businessId: 'test-business-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createTestService = (overrides = {}) => ({
  id: 'test-service-1',
  name: 'Test Service',
  description: 'Test service description',
  duration: 30,
  price: 25.00,
  isActive: true,
  businessId: 'test-business-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createTestAppointment = (overrides = {}) => ({
  id: 'test-appointment-1',
  startTime: new Date('2024-01-01T10:00:00Z'),
  endTime: new Date('2024-01-01T10:30:00Z'),
  status: 'confirmed',
  customerName: 'Test Customer',
  customerEmail: 'customer@test.com',
  customerPhone: '+1234567890',
  notes: 'Test appointment',
  serviceId: 'test-service-1',
  employeeId: 'test-employee-1',
  businessId: 'test-business-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// Test utilities
export const testUtils = {
  // Clean up test data
  async cleanupTestData() {
    // This would be implemented with actual database cleanup
    console.log('Cleaning up test data...')
  },
  
  // Setup test data
  async setupTestData() {
    console.log('Setting up test data...')
  },
  
  // Generate random test data
  generateRandomEmail: () => `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
  generateRandomPhone: () => `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  generateRandomId: () => `test-${Math.random().toString(36).substr(2, 9)}`,
}
