# Publish/Unpublish System - Quick Reference

## 🎯 What It Does

Allows users to control whether their pages are publicly visible:
- **Draft** - Only visible to owner in editor
- **Published** - Publicly visible at `/p/:slug`

## 🔗 API Endpoints

### Publish
```bash
POST /api/pages/:id/publish
Authorization: Bearer <token>
Body: { "id": "page-id" }
```

### Unpublish
```bash
POST /api/pages/:id/unpublish
Authorization: Bearer <token>
Body: { "id": "page-id" }
```

## 📊 Status Flow

```
Draft Page
    ↓
User clicks "Publish"
    ↓
API validates & updates
    ↓
Published Page
    ↓
Accessible at /p/:slug
    ↓
User clicks "Unpublish"
    ↓
Back to Draft
```

## 🎨 UI Components

### Dashboard
- Status badge (Draft/Published)
- Publish/Unpublish in menu
- Share button (published only)

### Editor
- Status badge in header
- Publish/Unpublish button (top right)
- Auto-save before publish

## ✅ Validation

Before publishing:
- ✅ User authenticated
- ✅ User owns page
- ✅ Page has title
- ✅ Page exists

## 🧪 Testing

### Publish
```bash
curl -X POST https://domain.com/api/pages/page-id/publish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"id":"page-id"}'
```

### Unpublish
```bash
curl -X POST https://domain.com/api/pages/page-id/unpublish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"id":"page-id"}'
```

## 📁 Files

### Backend
- `netlify/functions/pages-publish.ts`
- `netlify/functions/pages-unpublish.ts`

### Frontend
- `client/src/pages/dashboard.tsx`
- `client/src/pages/PageEditor.tsx`
- `client/src/api/pages.ts`

## 🔐 Security

✅ JWT authentication required
✅ User ownership check
✅ Page validation
✅ Error handling

## 🚀 Deployment

```bash
./deploy.sh
```

## 📈 Features

✅ Publish/unpublish toggle
✅ Status badges
✅ Toast notifications
✅ Loading states
✅ Unsaved changes warning
✅ Share button
✅ View tracking
✅ Contact form

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot publish | Check page has title |
| Button disabled | Save unsaved changes first |
| Status not updating | Refresh page |
| Page not accessible | Verify status is "published" |

## 📞 Support

See `PUBLISH_UNPUBLISH_SYSTEM.md` for complete documentation.

---

**Status: PRODUCTION READY** ✅
