# Testing Guide - Barbería Elite

This project includes a comprehensive testing suite with unit tests, integration tests, and end-to-end tests.

## 🧪 Testing Stack

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **Playwright** - End-to-end testing
- **Prisma Test Environment** - Database testing utilities

## 📁 Test Structure

```
src/
├── app/api/__tests__/          # API route tests
├── components/__tests__/        # Component tests
├── lib/__tests__/              # Utility and integration tests
├── mocks/                      # MSW handlers and server setup
e2e/                           # End-to-end tests
```

## 🚀 Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed
```

### All Tests
```bash
# Run both unit and E2E tests
npm run test:all
```

## 📋 Test Categories

### 1. Unit Tests (`src/**/__tests__/`)

**API Routes** (`src/app/api/__tests__/api-routes.test.ts`)
- Tests all API endpoints with mocked database
- Validates request/response handling
- Tests error scenarios and edge cases

**Components** (`src/components/__tests__/components.test.tsx`)
- Tests React component rendering
- Tests user interactions
- Tests responsive behavior

### 2. Integration Tests (`src/lib/__tests__/`)

**Database Operations** (`src/lib/__tests__/database-integration.test.ts`)
- Tests database CRUD operations
- Tests complex queries and relationships
- Tests error handling and retry logic

### 3. End-to-End Tests (`e2e/`)

**User Workflows** (`e2e/app.spec.ts`)
- Tests complete user journeys
- Tests cross-browser compatibility
- Tests responsive design
- Tests admin panel functionality

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- Next.js integration
- TypeScript support
- Module path mapping
- Coverage collection

### Playwright Configuration (`playwright.config.ts`)
- Multi-browser testing
- Mobile device testing
- Automatic dev server startup
- Trace collection for debugging

### MSW Setup (`src/mocks/`)
- API request mocking
- Realistic response data
- Error scenario simulation

## 📊 Test Data

### Test Utilities (`src/lib/testUtils.ts`)
- Factory functions for test data
- Database configuration for tests
- Cleanup utilities

### Mock Data (`src/mocks/handlers.ts`)
- Realistic API responses
- Error scenarios
- Edge case handling

## 🎯 Testing Best Practices

### 1. Unit Tests
- Test one thing at a time
- Use descriptive test names
- Mock external dependencies
- Test both success and error cases

### 2. Integration Tests
- Test real database operations
- Use test database
- Clean up after tests
- Test complex workflows

### 3. End-to-End Tests
- Test complete user journeys
- Use realistic data
- Test on multiple devices
- Focus on critical paths

## 🐛 Debugging Tests

### Jest Debugging
```bash
# Run specific test file
npm test -- api-routes.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should return employees"

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debugging
```bash
# Run tests in headed mode
npm run test:e2e:headed

# Run specific test
npx playwright test app.spec.ts --headed

# Debug with UI
npm run test:e2e:ui
```

## 📈 Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

## 🚨 Common Issues

### 1. Database Connection Issues
- Ensure test database is configured
- Check environment variables
- Verify Prisma client generation

### 2. Mock Issues
- Check MSW handlers are properly configured
- Verify mock data matches expected format
- Ensure handlers are reset between tests

### 3. E2E Test Failures
- Check if dev server is running
- Verify selectors are correct
- Check for timing issues

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
