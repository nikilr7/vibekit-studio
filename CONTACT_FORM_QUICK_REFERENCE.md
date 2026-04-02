# Contact Form System - Quick Reference

## 🎯 What It Does

Allows visitors to submit contact messages on public pages with validation, storage, and dashboard integration.

## 🔗 API Endpoints

### Submit Contact Form
```bash
POST /api/public/pages/:slug/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your services."
}
```

### Get Submissions (Dashboard)
```bash
GET /api/pages/:pageId/submissions
Authorization: Bearer <token>
```

## 📊 Form Flow

```
User fills form
    ↓
Clicks "Send Message"
    ↓
Frontend validation
    ↓
POST to API
    ↓
Backend validation
    ↓
Store in database
    ↓
Show success/error
    ↓
Clear form on success
```

## ✅ Validation Rules

### Name
- Required (if enabled)
- Min 2 characters
- Max 100 characters

### Email
- Required (if enabled)
- Valid email format
- Max 255 characters

### Message
- Required (if enabled)
- Min 10 characters
- Max 5000 characters

## 🔐 Security Features

✅ Input validation (frontend & backend)
✅ Sanitization (remove special chars)
✅ Rate limiting (5 per IP per hour)
✅ SQL injection prevention
✅ Error handling (no DB errors exposed)

## 📁 Files

### Backend
- `netlify/functions/pages-contact.ts` - Submit form
- `netlify/functions/pages-submissions.ts` - Get submissions
- `netlify/functions/migrate-contact-submissions.ts` - Database migration

### Frontend
- `client/src/components/LivePreview.tsx` - Form UI
- `client/src/components/Messages.tsx` - Submissions list

### Database
- `contact_submissions` table

## 🧪 Testing

### Submit Form
```bash
curl -X POST https://domain.com/api/public/pages/test-page/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message with enough characters"
  }'
```

### Get Submissions
```bash
curl https://domain.com/api/pages/page-id/submissions \
  -H "Authorization: Bearer <token>"
```

## 🚀 Deployment

### 1. Database Migration
```bash
curl -X POST https://domain.netlify.app/.netlify/functions/migrate-contact-submissions
```

### 2. Deploy Code
```bash
./deploy.sh
```

### 3. Verify
```bash
# Test form submission
curl -X POST https://domain.com/api/public/pages/test-page/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message here"}'

# Check database
psql $DATABASE_URL -c "SELECT * FROM contact_submissions LIMIT 1;"
```

## 📈 Features

✅ Form validation
✅ Error handling
✅ Loading states
✅ Success messages
✅ Rate limiting
✅ Dashboard integration
✅ Email replies
✅ Responsive design

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Form not submitting | Check network tab for errors |
| Invalid email error | Verify email format |
| Message too short | Message must be 10+ characters |
| Rate limit error | Wait 1 hour before retrying |
| Page not found | Verify page is published |

## 📞 Support

See `CONTACT_FORM_SYSTEM.md` for complete documentation.

---

**Status: PRODUCTION READY** ✅
