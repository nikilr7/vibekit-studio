# VibeKit Studio - Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No console errors or warnings
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code linting passes (`npm run lint`)
- [ ] No security vulnerabilities (`npm audit`)

### Security
- [ ] No secrets in code or .env files
- [ ] All environment variables configured
- [ ] JWT secret is strong (32+ characters)
- [ ] Database credentials are secure
- [ ] CORS properly configured
- [ ] Security headers configured in netlify.toml
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

### Performance
- [ ] Build size optimized
- [ ] Images optimized
- [ ] Code splitting configured
- [ ] Lazy loading implemented
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Caching headers set

### Database
- [ ] PostgreSQL database created
- [ ] All migrations run
- [ ] Indexes created
- [ ] Backups configured
- [ ] Connection string verified
- [ ] Pool size configured (20 for production)

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics enabled
- [ ] Logging configured
- [ ] Uptime monitoring set up
- [ ] Performance monitoring enabled

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Deployment steps documented
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide created

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Environment

```bash
# Clone repository
git clone <repo-url>
cd vibekit-studio

# Install dependencies
npm install
cd client && npm install && cd ..

# Create production environment file
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

### Step 2: Configure Database

```bash
# Create PostgreSQL database
createdb vibekit_prod

# Run migrations
npm run migrate:prod

# Verify database connection
npm run db:test
```

### Step 3: Build Application

```bash
# Build frontend
cd client
npm run build:prod
cd ..

# Verify build
ls -la client/dist/

# Build backend functions
npm run build:functions
```

### Step 4: Test Production Build Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test locally
netlify dev

# Verify all endpoints work
# - Login: http://localhost:8888
# - Dashboard: http://localhost:8888/app
# - Public page: http://localhost:8888/p/test-slug
```

### Step 5: Deploy to Netlify

```bash
# Login to Netlify
netlify login

# Link to site
netlify link

# Deploy to production
netlify deploy --prod

# Verify deployment
netlify status
```

### Step 6: Post-Deployment Verification

```bash
# Check deployment status
netlify status

# View logs
netlify logs

# Run health checks
curl https://your-domain.com/
curl https://your-domain.com/.netlify/functions/auth
```

### Step 7: Monitor & Verify

- [ ] Landing page loads
- [ ] Signup works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Can create page
- [ ] Editor works
- [ ] Can publish
- [ ] Public page accessible
- [ ] Share button works
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security headers present

---

## 🔧 Configuration Details

### Environment Variables

**Required:**
```
DATABASE_URL=postgresql://user:password@host:5432/vibekit_prod
JWT_SECRET=your-super-secret-key-min-32-chars
```

**Recommended:**
```
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
ENABLE_ANALYTICS=true
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Configuration

**Connection Pool:**
```
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000
```

**Backup:**
```bash
# Daily backup
pg_dump vibekit_prod > backup_$(date +%Y%m%d).sql

# Restore from backup
psql vibekit_prod < backup_20240101.sql
```

### Security Headers

All security headers are configured in `netlify.toml`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- Referrer-Policy

### Rate Limiting

```
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

Applies to:
- Login attempts
- API endpoints
- File uploads

---

## 📊 Performance Optimization

### Frontend Optimization

```bash
# Build with optimization
npm run build:prod

# Analyze bundle size
npm run analyze

# Expected sizes:
# - Main bundle: < 200KB
# - CSS: < 50KB
# - Total: < 300KB
```

### Backend Optimization

```bash
# Database indexes
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_slug ON pages(slug);

# Connection pooling
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000
```

### Caching Strategy

```
Static assets: 1 year (immutable)
HTML: 1 hour (must-revalidate)
API: no-cache (always fresh)
```

---

## 🔐 Security Hardening

### Before Deployment

1. **Secrets Management**
   ```bash
   # Verify no secrets in code
   git grep -i "password\|secret\|key" -- '*.ts' '*.tsx' '*.js'
   ```

2. **Dependency Audit**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Security Headers**
   - Verify in netlify.toml
   - Test with: https://securityheaders.com

4. **CORS Configuration**
   ```
   CORS_ORIGIN=https://your-domain.com
   CORS_CREDENTIALS=true
   ```

5. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - API: 100 requests per 15 minutes
   - Upload: 10 files per hour

### Monitoring

```bash
# Enable error tracking
SENTRY_DSN=your-sentry-dsn

# Enable analytics
ENABLE_ANALYTICS=true

# Monitor logs
netlify logs --tail
```

---

## 🚨 Rollback Procedure

### If Deployment Fails

```bash
# Rollback to previous version
netlify deploy --prod --alias=rollback

# Or use Netlify UI
# 1. Go to Deploys
# 2. Find previous successful deploy
# 3. Click "Publish deploy"
```

### If Database Migration Fails

```bash
# Rollback migration
npm run migrate:rollback

# Verify database state
npm run db:status

# Re-run migration
npm run migrate:prod
```

---

## 📈 Monitoring & Maintenance

### Daily Checks

```bash
# Check deployment status
netlify status

# Check error logs
netlify logs --tail

# Monitor performance
# - Lighthouse score
# - API response times
# - Database query times
```

### Weekly Checks

```bash
# Database maintenance
VACUUM ANALYZE;

# Check for unused indexes
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

# Review error logs
# - Check for patterns
# - Address common errors
```

### Monthly Checks

```bash
# Security audit
npm audit

# Dependency updates
npm outdated

# Performance review
# - Bundle size
# - API response times
# - Database performance

# Backup verification
# - Test restore
# - Verify data integrity
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Database connection fails**
```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check pool size
# Increase if needed: DB_POOL_SIZE=30
```

**Issue: API timeouts**
```bash
# Check function logs
netlify logs --tail

# Increase timeout
# In netlify.toml: timeout = 30

# Optimize queries
# Add indexes, use pagination
```

**Issue: High memory usage**
```bash
# Check for memory leaks
# Monitor with: node --inspect

# Reduce pool size
# DB_POOL_SIZE=10

# Enable garbage collection
# NODE_OPTIONS="--max-old-space-size=512"
```

**Issue: Slow page loads**
```bash
# Check bundle size
npm run analyze

# Enable caching
# Verify cache headers in netlify.toml

# Optimize images
# Use WebP format, compress

# Enable CDN
# Netlify CDN is automatic
```

---

## 📞 Support & Escalation

### Monitoring Services

1. **Error Tracking**: Sentry
   - Real-time error alerts
   - Stack traces
   - User context

2. **Performance**: Netlify Analytics
   - Page load times
   - API response times
   - Error rates

3. **Uptime**: Uptime Robot
   - 5-minute checks
   - Email alerts
   - Status page

### Escalation Path

1. **Level 1**: Check logs and metrics
2. **Level 2**: Review recent changes
3. **Level 3**: Rollback if necessary
4. **Level 4**: Database investigation
5. **Level 5**: Contact Netlify support

---

## ✅ Post-Deployment Checklist

- [ ] All endpoints responding
- [ ] No error logs
- [ ] Performance acceptable
- [ ] Security headers present
- [ ] Database connected
- [ ] Backups running
- [ ] Monitoring active
- [ ] Team notified
- [ ] Documentation updated
- [ ] Runbook created

---

## 📋 Deployment Checklist Summary

```
PRE-DEPLOYMENT
├── Code Quality
│   ├── Tests passing
│   ├── No TypeScript errors
│   ├── Linting passes
│   └── No security vulnerabilities
├── Security
│   ├── No secrets in code
│   ├── Environment variables configured
│   ├── Security headers set
│   └── Rate limiting enabled
├── Performance
│   ├── Build optimized
│   ├── Database indexes created
│   └── Caching configured
└── Database
    ├── Created
    ├── Migrations run
    └── Backups configured

DEPLOYMENT
├── Build application
├── Test locally
├── Deploy to Netlify
└── Verify endpoints

POST-DEPLOYMENT
├── Monitor logs
├── Check performance
├── Verify security
└── Update documentation
```

---

## 🎉 Deployment Complete!

Your VibeKit Studio is now live in production.

**Next Steps:**
1. Monitor error logs for 24 hours
2. Gather user feedback
3. Plan Phase 2 features
4. Set up analytics dashboard

**Support:** For issues, check logs or contact Netlify support.

---

**Deployment Date:** [Date]  
**Deployed By:** [Your Name]  
**Status:** ✅ LIVE IN PRODUCTION