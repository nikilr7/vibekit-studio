# Public Page Architecture & Flow Diagrams

## 1. Page Load Flow

```
User visits /p/:slug
        ↓
PublicPage component mounts
        ↓
Fetch page data: GET /api/public/pages/:slug
        ↓
Page data received
        ↓
Apply theme to document
        ↓
Set page title
        ↓
Render LivePreview component
        ↓
Track view: POST /api/public/pages/:slug/view (non-blocking)
        ↓
Page fully loaded
```

## 2. View Tracking Flow

```
Page loads
        ↓
useEffect triggers (page loaded)
        ↓
Check if view already tracked
        ↓
POST /api/public/pages/:slug/view
        ↓
Backend: Increment view_count
        ↓
Return updated count
        ↓
Frontend: Set viewTracked = true
        ↓
(No UI impact - fire and forget)
```

## 3. Contact Form Submission Flow

```
User fills form
        ↓
User clicks "Send Message"
        ↓
handleSubmit triggered
        ↓
Frontend validation
        ↓
Set isSubmitting = true
        ↓
POST /api/public/pages/:slug/contact
        ↓
Backend validation
        ↓
Store in database
        ↓
Return success response
        ↓
Show success toast
        ↓
Clear form
        ↓
Set isSubmitting = false
```

## 4. Component Architecture

```
App.tsx
  ↓
PublicPage.tsx
  ├─ Fetch page data
  ├─ Track view
  ├─ Handle contact submission
  └─ LivePreview
      ├─ Hero Section
      ├─ Features Section
      ├─ Gallery Section
      │   └─ GalleryImage (with error handling)
      └─ Contact Section
          └─ ContactForm (with submission handling)
```

## 5. API Endpoint Architecture

```
Frontend Requests
        ↓
Netlify Redirects (netlify.toml)
        ↓
Serverless Functions
        ├─ pages-public.ts (GET)
        ├─ pages-view.ts (POST)
        └─ pages-contact.ts (POST)
        ↓
Database (PostgreSQL)
        ├─ pages table (view_count)
        └─ contact_submissions table
```

## 6. Database Schema

```
pages table
├─ id (UUID)
├─ title (VARCHAR)
├─ slug (VARCHAR)
├─ content (JSONB)
├─ theme (VARCHAR)
├─ status (VARCHAR: draft/published)
├─ view_count (INTEGER) ← NEW
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

contact_submissions table ← NEW
├─ id (UUID)
├─ page_id (UUID) → pages.id
├─ name (VARCHAR)
├─ email (VARCHAR)
├─ message (TEXT)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)
```

## 7. Request/Response Flow

### View Tracking
```
Frontend                    Backend                 Database
   │                          │                         │
   ├─ POST /view ────────────→│                         │
   │                          ├─ UPDATE view_count ────→│
   │                          │                         │
   │                          │←─ Updated count ────────┤
   │←─ { view_count: 43 } ────┤                         │
   │                          │                         │
```

### Contact Form
```
Frontend                    Backend                 Database
   │                          │                         │
   ├─ POST /contact ──────────→│                         │
   │  { name, email, msg }     ├─ Validate ─────────────→│
   │                          │                         │
   │                          ├─ INSERT submission ────→│
   │                          │                         │
   │                          │←─ Submission ID ────────┤
   │←─ { id, message } ────────┤                         │
   │                          │                         │
```

## 8. Error Handling Flow

```
Request received
        ↓
Validate input
        ├─ Invalid → Return error response
        └─ Valid → Continue
        ↓
Query database
        ├─ Error → Return 500 error
        └─ Success → Continue
        ↓
Process data
        ├─ Error → Return 500 error
        └─ Success → Continue
        ↓
Return success response
```

## 9. Frontend State Management

```
PublicPage Component
├─ page: Page | null
├─ loading: boolean
├─ error: string | null
├─ viewTracked: boolean
└─ onContactSubmit: (data) => Promise<boolean>

LivePreview Component
└─ ContactForm Component
    ├─ formData: { name, email, message }
    ├─ isSubmitting: boolean
    ├─ submitError: string | null
    └─ handleSubmit: (e) => Promise<void>
```

## 10. Validation Pipeline

```
Frontend Validation
├─ Name: max 100 chars, not empty
├─ Email: valid format
└─ Message: max 5000 chars, not empty
        ↓
Backend Validation
├─ Name: max 100 chars, not empty
├─ Email: valid format
└─ Message: max 5000 chars, not empty
        ↓
Database Constraints
├─ Foreign key: page_id → pages.id
└─ Cascade delete on page deletion
```

## 11. Performance Optimization

```
Page Load
├─ Fetch page data (blocking)
├─ Apply theme (sync)
├─ Render UI (sync)
└─ Track view (non-blocking)
    └─ Fire and forget
    └─ No UI impact
    └─ ~50ms

Contact Form
├─ Frontend validation (sync)
├─ Show loading state (sync)
├─ Submit form (async)
│   └─ Backend validation
│   └─ Database insert
│   └─ ~500ms
└─ Show result (sync)
```

## 12. Security Flow

```
Request received
        ↓
Check HTTP method
        ├─ Invalid → 405 error
        └─ Valid → Continue
        ↓
Extract and validate slug
        ├─ Missing → 400 error
        └─ Valid → Continue
        ↓
Validate input data
        ├─ Invalid → 400 error
        └─ Valid → Continue
        ↓
Query database (parameterized)
        ├─ SQL injection prevented
        └─ Continue
        ↓
Check page status (published only)
        ├─ Not published → 404 error
        └─ Published → Continue
        ↓
Process request
        ↓
Return response
```

## 13. Deployment Flow

```
Code changes
        ↓
Run tests
        ↓
Build project
        ↓
Run database migration
        ├─ Add view_count column
        └─ Create contact_submissions table
        ↓
Deploy to Netlify
        ├─ Upload functions
        ├─ Update netlify.toml
        └─ Deploy frontend
        ↓
Verify deployment
        ├─ Test public page
        ├─ Test view tracking
        └─ Test contact form
        ↓
Monitor logs
```

## 14. Monitoring & Logging

```
Frontend
├─ Console errors
├─ Network requests
└─ User interactions

Backend
├─ Function logs
├─ Database queries
└─ Error tracking

Database
├─ Query performance
├─ Connection pool
└─ Data integrity
```

## 15. Scaling Considerations

```
Current Architecture
├─ Single database connection pool
├─ Serverless functions (auto-scaling)
├─ Netlify CDN for static assets
└─ No caching layer

Future Enhancements
├─ Redis cache for view counts
├─ Database read replicas
├─ CDN for API responses
├─ Rate limiting
└─ Webhook integration
```

---

## Summary

The public page feature uses a clean, scalable architecture:

1. **Frontend:** React components with state management
2. **Backend:** Serverless functions with database operations
3. **Database:** PostgreSQL with proper indexing
4. **Deployment:** Netlify with automatic scaling
5. **Security:** Input validation, parameterized queries, published-only access
6. **Performance:** Non-blocking view tracking, optimized queries
7. **Monitoring:** Comprehensive logging and error handling

All components work together to provide a seamless experience for users viewing published pages and submitting contact forms.
