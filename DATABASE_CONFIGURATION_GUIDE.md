# Production-Ready Database Configuration Guide

## Overview
This guide provides a comprehensive, production-ready database configuration for your booking system that can handle high traffic and provide reliable service to businesses.

## Environment Variables Setup

### Required Environment Variables
Add these to your `.env.local` file:

```bash
# Primary Database Connection (Session Pooler - Recommended)
DATABASE_URL="postgresql://postgres.wcrxivmbtfwpbamcktvk:Ordenata123!@aws-1-eu-north-1.pooler.supabase.com:5432/postgres?pgbouncer=true&pool_timeout=0&statement_timeout=0&connect_timeout=60"

# Direct Connection (Fallback for migrations and admin operations)
DATABASE_URL_DIRECT="postgresql://postgres.wcrxivmbtfwpbamcktvk:Ordenata123!@aws-1-eu-north-1.supabase.co:5432/postgres?connect_timeout=60"

# Transaction Pooler (High-concurrency operations)
DATABASE_URL_TRANSACTION="postgresql://postgres.wcrxivmbtfwpbamcktvk:Ordenata123!@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&prepared_statements=false&pool_timeout=0&statement_timeout=0&connect_timeout=60"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://wcrxivmbtfwpbamcktvk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_KVy4z7md-X8-onwsw4HCDA_pP7rb8np"
SUPABASE_SERVICE_ROLE_KEY="sb_secret_zzoQE0JWEnidwjQHLbrtlA_UtZk9Imz"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG="sample-business"

# Database Connection Settings
DB_CONNECTION_TIMEOUT=60000
DB_QUERY_TIMEOUT=30000
DB_POOL_SIZE=10
DB_MAX_RETRIES=3
DB_RETRY_DELAY=1000

# Monitoring and Logging
ENABLE_DB_MONITORING=true
LOG_LEVEL="info"
```

## Connection Strategy Explanation

### 1. Session Pooler (Primary - Port 5432)
- **Use Case**: Most database operations
- **Benefits**: Handles prepared statements properly, IPv4 compatible
- **Configuration**: `pgbouncer=true&pool_timeout=0&statement_timeout=0`

### 2. Direct Connection (Fallback - Port 5432)
- **Use Case**: Migrations, admin operations, when pooler fails
- **Benefits**: Direct connection, no pooling overhead
- **Configuration**: Simple connection string without pooling

### 3. Transaction Pooler (High Concurrency - Port 6543)
- **Use Case**: High-traffic operations, bulk operations
- **Benefits**: Optimized for transaction pooling
- **Configuration**: `prepared_statements=false` to avoid prepared statement conflicts

## Production Recommendations

### For Small to Medium Businesses (1-100 concurrent users)
- Use Session Pooler as primary
- Direct connection as fallback
- Monitor connection health via `/api/health`

### For Large Businesses (100+ concurrent users)
- Consider upgrading to Supabase Pro plan
- Implement connection pooling at application level
- Use multiple database instances for read/write splitting

### For Enterprise Clients (1000+ concurrent users)
- Upgrade to Supabase Team/Enterprise plan
- Implement database clustering
- Use dedicated database instances
- Implement caching layer (Redis)

## Monitoring and Health Checks

### Health Check Endpoint
Access `/api/health` to monitor database status:
- Connection health
- Circuit breaker status
- Response times
- Error rates

### Circuit Breaker Pattern
- Automatically switches between connection strategies
- Prevents cascade failures
- Self-healing when connections recover

### Retry Mechanism
- Exponential backoff with jitter
- Configurable retry attempts
- Timeout protection
- Comprehensive error handling

## Troubleshooting Common Issues

### Connection Timeouts
1. Check Supabase dashboard for service status
2. Verify connection string parameters
3. Monitor `/api/health` endpoint
4. Check network connectivity

### Prepared Statement Errors
1. Use transaction pooler with `prepared_statements=false`
2. Ensure proper connection cleanup
3. Monitor connection pool usage

### High Memory Usage
1. Implement connection pooling limits
2. Monitor active connections
3. Use connection timeouts
4. Implement proper cleanup

## Performance Optimization

### Database Indexing
Ensure proper indexes on frequently queried columns:
- `business.slug`
- `employee.businessId`
- `service.businessId`
- `appointment.businessId`
- `appointment.startTime`

### Query Optimization
- Use `select` to limit returned fields
- Implement pagination for large datasets
- Use database-level filtering
- Avoid N+1 queries with proper `include`

### Caching Strategy
- Cache frequently accessed data (business settings, services)
- Implement Redis for session management
- Use CDN for static assets
- Cache API responses where appropriate

## Security Considerations

### Connection Security
- Use SSL connections (enabled by default in Supabase)
- Rotate database passwords regularly
- Use environment variables for sensitive data
- Implement proper access controls

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all API communications
- Implement proper authentication
- Regular security audits

## Scaling Strategy

### Horizontal Scaling
- Multiple application instances
- Load balancer configuration
- Database read replicas
- Microservices architecture

### Vertical Scaling
- Increase Supabase plan limits
- Optimize database queries
- Implement caching layers
- Monitor resource usage

## Cost Optimization

### Supabase Plans
- **Free**: 500MB database, 2GB bandwidth
- **Pro**: $25/month, 8GB database, 250GB bandwidth
- **Team**: $599/month, 100GB database, 1TB bandwidth

### Optimization Tips
- Monitor database usage
- Implement efficient queries
- Use connection pooling
- Cache frequently accessed data

## Support and Maintenance

### Monitoring Tools
- Supabase Dashboard
- Application logs
- Health check endpoints
- Performance metrics

### Maintenance Tasks
- Regular database backups
- Monitor connection health
- Update dependencies
- Performance optimization

### Support Channels
- Supabase Support
- Community forums
- Documentation
- Professional services

## Migration Guide

### From Current Setup
1. Update environment variables
2. Deploy new database configuration
3. Test all endpoints
4. Monitor health checks
5. Gradual rollout to production

### Testing Checklist
- [ ] All API endpoints working
- [ ] Health check responding
- [ ] Circuit breaker functioning
- [ ] Retry mechanism working
- [ ] Error handling proper
- [ ] Performance acceptable

This configuration provides a robust, scalable, and production-ready database solution that can handle the demands of business clients while maintaining reliability and performance.
