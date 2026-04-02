# Create New Page Feature - VibeKit Studio

## Overview

The "Create New Page" feature allows authenticated users to quickly create a new mini website page with predefined structure and default content. Users can customize the page title and then edit all content in the page builder.

---

## 🏗️ Architecture

### Frontend Flow

```
User clicks "Create New Page"
    ↓
CreatePageDialog opens
    ↓
User enters page title (optional)
    ↓
Click "Create Page" button
    ↓
API call: POST /api/pages-create
    ↓
Page created with default content
    ↓
Redirect to /app/pages/:pageId (editor)
```

### Backend Flow

```
POST /api/pages-create
    ↓
Verify JWT token
    ↓
Extract userId from token
    ↓
Generate unique slug from "untitled-page"
    ↓
Create page with DEFAULT_PAGE_CONTENT
    ↓
Insert into database
    ↓
Return created page object
```

---

## 📦 Default Page Content Structure

```json
{
  "hero": {
    "title": "Your Page Title",
    "subtitle": "Create something amazing with VibeKit Studio",
    "buttonText": "Get Started",
    "buttonUrl": "#features"
  },
  "features": {
    "items": [
      {
        "title": "Fast",
        "description": "Lightning-quick performance optimized for speed"
      },
      {
        "title": "Reliable",
        "description": "Built to last with enterprise-grade stability"
      },
      {
        "title": "Modern",
        "description": "Latest design trends and technologies"
      },
      {
        "title": "Responsive",
        "description": "Perfect on mobile, tablet, and desktop"
      },
      {
        "title": "Secure",
        "description": "Industry-standard security and encryption"
      },
      {
        "title": "Scalable",
        "description": "Grows with your business needs"
      }
    ]
  },
  "gallery": {
    "images": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
      "..."
    ]
  },
  "contact": {
    "enabled": true,
    "fields": {
      "name": true,
      "email": true,
      "message": true
    }
  }
}
```

---

## 🔌 API Specification

### Endpoint: POST /api/pages-create

**Request:**
```bash
curl -X POST http://localhost:8888/.netlify/functions/pages-create \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Request Body:**
```json
{}
```
(Empty body - all defaults are server-side)

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Untitled Page",
  "slug": "untitled-page",
  "status": "draft",
  "theme": "minimal",
  "created_at": "2024-01-04T10:30:00Z",
  "updated_at": "2024-01-04T10:30:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized"
}
```

---

## 🎨 React Components

### CreatePageDialog Component

**Location:** `client/src/components/CreatePageDialog.tsx`

**Props:**
```typescript
interface CreatePageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pageId: string) => void;
}
```

**Features:**
- Modal dialog for page creation
- Title input field
- Loading state with spinner
- Error message display
- Enter key support
- Auto-focus on input
- Disabled state during API call

**Usage:**
```tsx
const [dialogOpen, setDialogOpen] = useState(false);

<CreatePageDialog
  isOpen={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onSuccess={(pageId) => navigate(`/app/pages/${pageId}`)}
/>
```

### Dashboard Integration

**Location:** `client/src/pages/dashboard.tsx`

**Changes:**
- Added `dialogOpen` state
- "Create New Page" button opens dialog
- `handleCreateSuccess` redirects to editor
- Empty state also has create button

---

## 🔐 Security

✅ **Authentication:**
- JWT token required in Authorization header
- Token verified server-side
- userId extracted from token (not client input)

✅ **Authorization:**
- Only authenticated users can create pages
- Pages automatically associated with logged-in user

✅ **Validation:**
- Slug uniqueness enforced per user
- Input sanitization on server
- Database constraints prevent invalid data

---

## 📊 Database Schema

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Page',
  content JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  theme VARCHAR(50) DEFAULT 'minimal',
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, slug)
);
```

---

## 🚀 User Flow

### Step 1: Dashboard
User sees "My Pages" dashboard with existing pages and "Create New Page" button.

### Step 2: Open Dialog
User clicks "Create New Page" → Dialog opens with title input.

### Step 3: Enter Title (Optional)
User can enter a custom title or leave blank for "Untitled Page".

### Step 4: Create
User clicks "Create Page" button → Loading state shows → Page created.

### Step 5: Redirect
User automatically redirected to `/app/pages/:pageId` (page editor).

### Step 6: Edit
User can now edit all sections, change theme, and publish.

---

## 🎯 State Management

### Dashboard State
```typescript
const [pages, setPages] = useState<Page[]>([]);
const [loading, setLoading] = useState(true);
const [dialogOpen, setDialogOpen] = useState(false);
```

### CreatePageDialog State
```typescript
const [title, setTitle] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

---

## 📝 API Client

**Location:** `client/src/api/pages.ts`

```typescript
export const pagesAPI = {
  async create(): Promise<CreatePageResponse> {
    const response = await fetch(`${API_BASE}/pages-create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },

  async update(id: string, data: Partial<Page>): Promise<Page> {
    // Update page title or other fields
  },
};
```

---

## ✨ UX Features

✅ **Loading State**
- Spinner shown during API call
- Button disabled during creation
- "Creating..." text displayed

✅ **Error Handling**
- Error messages displayed in dialog
- User can retry without closing dialog
- Clear error text

✅ **Success Feedback**
- Toast notification on success
- Automatic redirect to editor
- Dialog closes automatically

✅ **Accessibility**
- Auto-focus on input field
- Enter key support
- Clear labels and descriptions
- Keyboard navigation

✅ **Responsive Design**
- Works on mobile, tablet, desktop
- Touch-friendly buttons (44px+)
- Dialog responsive on all screens

---

## 🔄 Complete User Journey

```
1. User logs in → Lands on /app (Dashboard)
2. Clicks "Create New Page" button
3. CreatePageDialog opens
4. User enters title (e.g., "My Portfolio")
5. Clicks "Create Page"
6. Loading spinner shows
7. API creates page with default content
8. Page created successfully
9. User redirected to /app/pages/:pageId
10. Page editor loads with default content
11. User can now edit all sections
12. User publishes page
13. Page goes live at /pages/:slug
```

---

## 🧪 Testing Checklist

- [ ] Click "Create New Page" → Dialog opens
- [ ] Enter title → Title input works
- [ ] Leave title blank → Uses "Untitled Page"
- [ ] Click "Create Page" → Loading state shows
- [ ] Wait for API response → Page created
- [ ] Redirected to editor → URL is /app/pages/:id
- [ ] Page has default content → All sections present
- [ ] Edit page → Can modify content
- [ ] Publish page → Status changes to published
- [ ] View published page → Accessible at /pages/:slug
- [ ] Create another page → Slug is unique
- [ ] Error handling → Shows error message on failure

---

## 📚 Related Files

- `netlify/functions/pages-create.ts` - Backend API
- `client/src/components/CreatePageDialog.tsx` - Dialog component
- `client/src/pages/dashboard.tsx` - Dashboard page
- `client/src/api/pages.ts` - API client
- `client/src/types/page.ts` - TypeScript types
- `netlify/functions/auth.ts` - Authentication utility

---

## 🎓 Key Concepts

### Slug Generation
- Converts title to URL-friendly format
- Handles duplicates with counter (e.g., "my-page-2")
- Unique per user (not globally unique)

### Default Content
- Provides meaningful placeholder content
- All sections included by default
- Users can delete/modify sections in editor

### Theme System
- Default theme is "minimal"
- Can be changed in editor
- Affects page appearance and styling

### Status
- New pages start as "draft"
- Can be published to go live
- Published pages are accessible at /pages/:slug
