# Code Practices & Development Guidelines

## Core Principles

### 1. Modularity & Scalability
- **Component-based architecture**: Each feature should be a self-contained component
- **Reusable components**: Design components that can work across different business types
- **Separation of concerns**: Keep UI, business logic, and data access layers separate
- **Configuration-driven**: Use environment variables and config files for business-specific settings

### 2. Robustness & Error Handling
- **Graceful degradation**: System should work even if some features fail
- **Input validation**: Validate all user inputs on both client and server side
- **Error boundaries**: Implement proper error handling and user feedback
- **Fallback mechanisms**: Provide alternatives when external services are unavailable

### 3. Adaptability & Flexibility
- **Business-agnostic design**: Core system should work for any service-based business
- **Configurable business rules**: Hours, services, pricing should be easily adjustable
- **Multi-tenant ready**: Design with multiple businesses in mind
- **Theme system**: Color schemes, fonts, and branding should be easily customizable

## Code Standards

### Naming Conventions
- **Variables**: camelCase (`userName`, `bookingTime`)
- **Classes**: PascalCase (`BookingService`, `UserManager`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_BOOKING_DURATION`)
- **Files**: PascalCase for components (`BookingForm.tsx`), camelCase for utilities (`dateUtils.ts`)

### File Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── business/     # Business-specific components
│   └── forms/        # Form components
├── lib/
│   ├── utils/        # Utility functions
│   ├── validations/  # Input validation schemas
│   └── constants/    # App constants
├── hooks/            # Custom React hooks
├── types/           # TypeScript type definitions
└── config/          # Configuration files
```

### Database Design
- **Normalized structure**: Avoid data duplication
- **Soft deletes**: Use `deletedAt` instead of hard deletes
- **Audit trails**: Track creation and modification timestamps
- **Flexible schemas**: Use JSON fields for extensible data

### API Design
- **RESTful endpoints**: Follow REST conventions
- **Consistent responses**: Standardize API response format
- **Versioning**: Plan for API versioning from the start
- **Rate limiting**: Implement proper rate limiting
- **BusinessSlug parameter**: ALL API calls MUST include businessSlug parameter for multi-tenant support
- **Parameter consistency**: Ensure all API routes handle businessSlug parameter consistently

## Business Logic Guidelines

### Service Management
- **Dynamic services**: Services should be manageable through admin interface
- **Service categories**: Group services by type (haircuts, treatments, etc.)
- **Pricing flexibility**: Support different pricing models (fixed, hourly, variable)
- **Duration management**: Flexible duration settings per service

### Employee Management
- **Multi-employee support**: Handle multiple staff members
- **Skill assignments**: Assign services to specific employees
- **Working hours**: Flexible scheduling per employee
- **Availability management**: Handle time-offs and breaks

### Booking System
- **Real-time availability**: Show live availability
- **Conflict prevention**: Prevent double bookings
- **Buffer times**: Support setup/cleanup time between appointments
- **Recurring bookings**: Support repeat appointments

### Time Management
- **Timezone support**: Handle different timezones
- **Business hours**: Configurable operating hours
- **Holiday management**: Handle business closures
- **Break management**: Employee break times

## Security & Performance

### Security
- **Input sanitization**: Sanitize all user inputs
- **SQL injection prevention**: Use parameterized queries
- **Authentication**: Implement proper user authentication
- **Authorization**: Role-based access control
- **Data encryption**: Encrypt sensitive data

### Performance
- **Database indexing**: Proper database indexes
- **Caching**: Implement caching strategies
- **Image optimization**: Optimize images for web
- **Code splitting**: Lazy load components
- **CDN usage**: Use CDN for static assets

## Testing & Quality Assurance

### Testing Strategy
- **Unit tests**: Test individual functions and components
- **Integration tests**: Test component interactions
- **E2E tests**: Test complete user workflows
- **Performance tests**: Monitor system performance

### Code Quality
- **TypeScript**: Use TypeScript for type safety
- **ESLint**: Enforce code style and catch errors
- **Prettier**: Consistent code formatting
- **Code reviews**: Peer review process

## Documentation Requirements

### Code Documentation
- **JSDoc comments**: Document all functions and classes
- **README files**: Document each major component
- **API documentation**: Document all API endpoints
- **Database schema**: Document database structure

### User Documentation
- **Admin guides**: How to manage the system
- **User guides**: How to use the booking system
- **Setup guides**: How to deploy and configure
- **Troubleshooting**: Common issues and solutions

## Deployment & Maintenance

### Environment Management
- **Environment variables**: Use .env files for configuration
- **Secrets management**: Secure handling of API keys and passwords
- **Database migrations**: Version control for database changes
- **Backup strategies**: Regular data backups

### Monitoring & Logging
- **Error tracking**: Implement error tracking (Sentry, etc.)
- **Performance monitoring**: Monitor system performance
- **User analytics**: Track user behavior
- **Log management**: Structured logging

## Future-Proofing

### Extensibility
- **Plugin architecture**: Design for easy feature additions
- **API extensibility**: Design APIs for future integrations
- **Database flexibility**: Design for schema evolution
- **UI theming**: Support for different visual themes

### Scalability Considerations
- **Horizontal scaling**: Design for multiple server instances
- **Database scaling**: Plan for database scaling strategies
- **CDN integration**: Plan for global content delivery
- **Microservices**: Consider breaking into smaller services

## Business Adaptation Guidelines

### Multi-Business Support
- **Business profiles**: Each business should have its own profile
- **Custom branding**: Support custom logos, colors, fonts
- **Service customization**: Each business can define its own services
- **Pricing models**: Support different pricing strategies

### Industry Adaptations
- **Service types**: Support various service industries
- **Booking patterns**: Handle different booking requirements
- **Payment methods**: Support various payment options
- **Communication**: Different notification preferences

## Common Issues & Solutions

### Database Connection Errors (P1001)
**Problem**: `Can't reach database server` errors in API routes
**Root Cause**: API calls missing required `businessSlug` parameter
**Solution**: 
1. Check all `fetch()` calls include `?businessSlug=sample-business`
2. Ensure all API routes handle `businessSlug` parameter
3. Verify API route implementations are consistent

**Prevention**:
- Always include businessSlug in API calls: `fetch('/api/endpoint?businessSlug=sample-business')`
- Test all API endpoints after changes
- Use consistent parameter handling across all routes

### Admin Panel Data Loading Issues
**Problem**: Admin panel shows errors or fails to load data
**Root Cause**: Inconsistent API parameter usage
**Solution**:
1. Verify `useAdminData.ts` includes businessSlug in all calls
2. Check `QuickAppointment.tsx` and `BookingForm.tsx` for missing parameters
3. Ensure all API routes handle businessSlug consistently

**Prevention**:
- Always test admin panel after API changes
- Use TypeScript to catch parameter mismatches
- Implement consistent error handling

### Compiled JavaScript Syntax Errors
**Problem**: Syntax errors in compiled JavaScript (e.g., missing closing braces)
**Root Cause**: Source code has syntax errors that prevent proper compilation
**Solution**:
1. Check source files for missing braces, semicolons, or syntax errors
2. Use TypeScript compiler to catch syntax issues: `npx tsc --noEmit`
3. Verify all API route files have proper syntax

**Prevention**:
- Use TypeScript for type safety
- Run linting before commits
- Test compilation regularly

This document should be updated as the system evolves and new requirements emerge.
