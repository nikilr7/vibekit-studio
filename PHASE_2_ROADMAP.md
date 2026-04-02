# VibeKit Studio - Phase 2 Roadmap

## Overview
Phase 1 (MVP) is complete with all core requirements met. Phase 2 focuses on enhanced features that increase user engagement, retention, and monetization potential.

---

## 🎯 Phase 2 Goals
- Increase user engagement with analytics
- Improve discoverability with SEO
- Enable custom branding with domain support
- Accelerate page creation with templates
- Enhance editing capabilities

---

## 📊 PRIORITY 1: Analytics & Insights (High Impact)

### 1.1 View Tracking
**What:** Track page views for each published page

**Implementation:**
```typescript
// New endpoint: netlify/functions/pages-track-view.ts
- Increment view count when page is accessed
- Store timestamp and basic metadata
- Prevent duplicate counts (IP-based or session-based)
```

**Database Changes:**
```sql
ALTER TABLE pages ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN last_viewed_at TIMESTAMP;
CREATE TABLE page_views (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

**Frontend Changes:**
- Display view count on dashboard
- Show "Last viewed" timestamp
- Add analytics badge on page cards

**Files to Create:**
- `netlify/functions/pages-track-view.ts`
- `client/src/components/AnalyticsBadge.tsx`
- `client/src/pages/AnalyticsDashboard.tsx`

**Effort:** 2-3 days

---

### 1.2 Analytics Dashboard
**What:** Detailed analytics page showing page performance

**Features:**
- Total views across all pages
- Top performing pages
- View trends (last 7 days, 30 days)
- Referrer tracking
- Device breakdown (mobile/tablet/desktop)

**Implementation:**
```typescript
// New endpoints:
- /pages-analytics (get analytics for all pages)
- /pages-analytics/:id (get analytics for specific page)
- /pages-analytics/:id/trends (get view trends)
```

**Frontend:**
- Charts using Chart.js or Recharts
- Date range picker
- Export analytics as CSV

**Files to Create:**
- `client/src/pages/AnalyticsDashboard.tsx`
- `client/src/components/AnalyticsChart.tsx`
- `client/src/components/AnalyticsTable.tsx`

**Effort:** 3-4 days

---

## 🔍 PRIORITY 2: SEO & Social Sharing (Medium Impact)

### 2.1 Meta Tags & Open Graph
**What:** Allow users to customize SEO metadata

**Implementation:**
```typescript
// Add to pages table:
ALTER TABLE pages ADD COLUMN meta_title VARCHAR(60);
ALTER TABLE pages ADD COLUMN meta_description VARCHAR(160);
ALTER TABLE pages ADD COLUMN meta_keywords VARCHAR(255);
ALTER TABLE pages ADD COLUMN og_image VARCHAR(500);
```

**Editor UI:**
- SEO settings panel in page editor
- Character counters for title/description
- Preview of how it looks in search results
- Open Graph preview

**Public Page:**
- Render meta tags in `<head>`
- Dynamic Open Graph tags for social sharing
- Structured data (JSON-LD)

**Files to Create:**
- `client/src/components/SEOEditor.tsx`
- `client/src/components/SEOPreview.tsx`
- `netlify/functions/pages-update.ts` (update to include SEO fields)

**Effort:** 2-3 days

---

### 2.2 Social Sharing Buttons
**What:** Easy sharing to social media

**Implementation:**
- Share buttons on published page
- Pre-filled social media posts
- QR code for page URL
- Copy link to clipboard

**Libraries:**
- `react-share` for social buttons
- `qrcode.react` for QR codes

**Files to Create:**
- `client/src/components/ShareButtons.tsx`
- `client/src/components/QRCode.tsx`

**Effort:** 1-2 days

---

## 🌐 PRIORITY 3: Custom Domains (High Impact)

### 3.1 Domain Connection
**What:** Allow users to connect custom domains

**Implementation:**
```typescript
// Add to users table:
ALTER TABLE users ADD COLUMN custom_domain VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN domain_verified BOOLEAN DEFAULT FALSE;

// Add to pages table:
ALTER TABLE pages ADD COLUMN custom_domain_slug VARCHAR(255);
```

**DNS Configuration:**
- CNAME record pointing to Netlify
- Verification via DNS TXT record
- SSL certificate auto-provisioning

**Backend:**
- Validate domain ownership
- Update routing rules
- Handle SSL certificates

**Frontend:**
- Domain settings page
- DNS configuration guide
- Verification status indicator

**Files to Create:**
- `client/src/pages/DomainSettings.tsx`
- `client/src/components/DomainVerification.tsx`
- `netlify/functions/domain-verify.ts`
- `netlify/functions/domain-connect.ts`

**Effort:** 4-5 days

---

### 3.2 Domain Routing
**What:** Route custom domains to correct pages

**Implementation:**
- Netlify redirect rules based on domain
- Subdomain support (pages.custom.com)
- Domain-specific analytics

**Files to Create:**
- `netlify.toml` (update with dynamic redirects)
- `netlify/functions/domain-router.ts`

**Effort:** 2-3 days

---

## 📝 PRIORITY 4: Page Templates (Medium Impact)

### 4.1 Template Library
**What:** Pre-built page templates for quick start

**Templates:**
1. Portfolio (hero + projects + contact)
2. Product Launch (hero + features + pricing + contact)
3. Event (hero + schedule + speakers + contact)
4. Blog (hero + featured posts + newsletter)
5. Service (hero + services + testimonials + contact)
6. Restaurant (hero + menu + gallery + reservation)

**Implementation:**
```typescript
// New table:
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  thumbnail_url VARCHAR(500),
  content JSONB,
  theme VARCHAR(50),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Backend:**
- Endpoint to list templates
- Endpoint to create page from template

**Frontend:**
- Template gallery on dashboard
- Template preview modal
- "Create from template" button

**Files to Create:**
- `client/src/pages/TemplateGallery.tsx`
- `client/src/components/TemplateCard.tsx`
- `client/src/components/TemplatePreview.tsx`
- `netlify/functions/templates-list.ts`
- `netlify/functions/pages-create-from-template.ts`

**Effort:** 3-4 days

---

### 4.2 Template Customization
**What:** Allow users to create and share custom templates

**Implementation:**
- Save current page as template
- Template marketplace
- Community templates

**Files to Create:**
- `client/src/components/SaveAsTemplate.tsx`
- `client/src/pages/TemplateMarketplace.tsx`

**Effort:** 2-3 days

---

## ✨ PRIORITY 5: Advanced Editor Features (Medium Impact)

### 5.1 Section Reordering
**What:** Drag-and-drop to reorder page sections

**Implementation:**
```typescript
// Add to pages content:
{
  sections: [
    { id: 'hero', order: 1, ... },
    { id: 'features', order: 2, ... },
    { id: 'gallery', order: 3, ... },
    { id: 'contact', order: 4, ... }
  ]
}
```

**Libraries:**
- `react-beautiful-dnd` or `dnd-kit`

**Frontend:**
- Drag handles on sections
- Visual feedback during drag
- Reorder preview

**Files to Create:**
- `client/src/components/SectionReorder.tsx`
- `client/src/components/DraggableSection.tsx`

**Effort:** 2-3 days

---

### 5.2 Undo/Redo
**What:** Undo and redo page edits

**Implementation:**
```typescript
// Use Immer for immutable state management
// Store edit history in state
const [history, setHistory] = useState<PageContent[]>([]);
const [historyIndex, setHistoryIndex] = useState(0);

const undo = () => setHistoryIndex(prev => Math.max(0, prev - 1));
const redo = () => setHistoryIndex(prev => Math.min(history.length - 1, prev + 1));
```

**Keyboard Shortcuts:**
- Ctrl+Z for undo
- Ctrl+Shift+Z for redo

**Files to Create:**
- `client/src/hooks/useHistory.ts`
- Update `PageEditor.tsx` to use history hook

**Effort:** 1-2 days

---

### 5.3 Keyboard Shortcuts
**What:** Common keyboard shortcuts for power users

**Shortcuts:**
- Ctrl+S: Save
- Ctrl+Z: Undo
- Ctrl+Shift+Z: Redo
- Ctrl+P: Publish
- Ctrl+/: Show shortcuts help

**Implementation:**
```typescript
// Custom hook for keyboard shortcuts
const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.key.toLowerCase()}`;
      shortcuts[key]?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
```

**Files to Create:**
- `client/src/hooks/useKeyboardShortcuts.ts`
- `client/src/components/ShortcutsHelp.tsx`

**Effort:** 1 day

---

### 5.4 Version History
**What:** Track and restore previous page versions

**Implementation:**
```typescript
// New table:
CREATE TABLE page_versions (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  content JSONB,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

**Backend:**
- Auto-save versions on each save
- Keep last 50 versions
- Endpoint to restore version

**Frontend:**
- Version history sidebar
- Preview of each version
- Restore button

**Files to Create:**
- `client/src/pages/VersionHistory.tsx`
- `client/src/components/VersionPreview.tsx`
- `netlify/functions/pages-versions.ts`
- `netlify/functions/pages-restore-version.ts`

**Effort:** 3-4 days

---

## 👥 PRIORITY 6: Collaboration (Lower Priority)

### 6.1 Team Sharing
**What:** Share pages with team members

**Implementation:**
```typescript
// New table:
CREATE TABLE page_collaborators (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50), -- 'viewer', 'editor', 'owner'
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- Invite collaborators via email
- Role-based permissions
- Activity log

**Files to Create:**
- `client/src/pages/PageSharing.tsx`
- `client/src/components/CollaboratorList.tsx`
- `netlify/functions/collaborators-invite.ts`

**Effort:** 3-4 days

---

### 6.2 Comments & Feedback
**What:** Leave comments on pages

**Implementation:**
```typescript
// New table:
CREATE TABLE page_comments (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  user_id UUID REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**
- Inline comments on sections
- Comment threads
- Notifications

**Files to Create:**
- `client/src/components/CommentThread.tsx`
- `client/src/components/InlineComments.tsx`
- `netlify/functions/comments-create.ts`

**Effort:** 2-3 days

---

## 📸 PRIORITY 7: Image Management (Medium Priority)

### 7.1 Image Upload
**What:** Upload images instead of just URLs

**Implementation:**
- Integrate with Cloudinary or AWS S3
- Image optimization
- CDN delivery

**Backend:**
- Generate signed upload URLs
- Store image metadata

**Frontend:**
- Drag-and-drop upload
- Image cropping
- Optimization preview

**Files to Create:**
- `client/src/components/ImageUploader.tsx`
- `client/src/components/ImageCropper.tsx`
- `netlify/functions/image-upload.ts`

**Effort:** 3-4 days

---

### 7.2 Image Gallery
**What:** Manage all uploaded images

**Implementation:**
- Gallery of all uploaded images
- Bulk operations
- Image organization

**Files to Create:**
- `client/src/pages/ImageGallery.tsx`
- `client/src/components/ImageGrid.tsx`

**Effort:** 2 days

---

## 💾 PRIORITY 8: Export & Backup (Lower Priority)

### 8.1 Export as HTML
**What:** Export page as standalone HTML

**Implementation:**
- Generate static HTML file
- Include all CSS and assets
- Download as ZIP

**Backend:**
- Render page to HTML string
- Bundle CSS and images

**Files to Create:**
- `netlify/functions/pages-export.ts`
- `client/src/components/ExportModal.tsx`

**Effort:** 2-3 days

---

### 8.2 Backup & Restore
**What:** Backup pages and restore from backup

**Implementation:**
- Auto-backup on publish
- Manual backup option
- Restore from backup

**Files to Create:**
- `client/src/pages/BackupSettings.tsx`
- `netlify/functions/backup-create.ts`
- `netlify/functions/backup-restore.ts`

**Effort:** 2 days

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1-2: Analytics (Priority 1)
- View tracking
- Analytics dashboard
- **Effort:** 5-7 days

### Week 3: SEO & Sharing (Priority 2)
- Meta tags
- Social sharing
- **Effort:** 3-5 days

### Week 4-5: Custom Domains (Priority 3)
- Domain connection
- Domain routing
- **Effort:** 6-8 days

### Week 6: Templates (Priority 4)
- Template library
- Template customization
- **Effort:** 5-7 days

### Week 7: Advanced Editor (Priority 5)
- Section reordering
- Undo/Redo
- Keyboard shortcuts
- Version history
- **Effort:** 6-8 days

### Week 8+: Collaboration & Extras (Priority 6-8)
- Team sharing
- Comments
- Image upload
- Export/Backup
- **Effort:** 10-15 days

---

## 📊 ESTIMATED EFFORT SUMMARY

| Feature | Effort | Priority |
|---------|--------|----------|
| Analytics | 5-7 days | 🔴 High |
| SEO & Sharing | 3-5 days | 🟡 Medium |
| Custom Domains | 6-8 days | 🔴 High |
| Templates | 5-7 days | 🟡 Medium |
| Advanced Editor | 6-8 days | 🟡 Medium |
| Collaboration | 5-7 days | 🟢 Low |
| Image Management | 5-7 days | 🟡 Medium |
| Export/Backup | 4-5 days | 🟢 Low |
| **TOTAL** | **39-54 days** | - |

---

## 💰 MONETIZATION OPPORTUNITIES

### Freemium Model
- **Free Tier:** 3 pages, basic themes, no custom domain
- **Pro Tier:** Unlimited pages, all themes, custom domain, analytics
- **Enterprise:** Team collaboration, priority support

### Pricing Suggestion
- **Free:** $0/month
- **Pro:** $9/month or $79/year
- **Enterprise:** Custom pricing

### Revenue Streams
1. Subscription (Pro/Enterprise)
2. Premium themes marketplace
3. Template marketplace
4. Custom domain premium
5. Analytics premium
6. API access for developers

---

## 🎯 SUCCESS METRICS

### User Engagement
- Pages created per user
- Pages published per user
- Average page views
- Return user rate

### Business Metrics
- User acquisition cost
- Lifetime value
- Churn rate
- Conversion rate (free to paid)

### Technical Metrics
- Page load time
- API response time
- Error rate
- Uptime

---

## 🔐 Security Considerations

### Phase 2 Security
- Rate limiting on API endpoints
- CORS configuration
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- CSRF tokens for state-changing operations
- Rate limiting for image uploads
- Virus scanning for uploaded images

---

## 📱 Mobile App Consideration

### Future Phase 3
- React Native mobile app
- Offline editing
- Push notifications
- Native image picker
- Biometric auth

---

## 🎓 CONCLUSION

Phase 2 roadmap provides a clear path to enhance VibeKit Studio with:
- **Analytics** for user insights
- **SEO** for discoverability
- **Custom domains** for branding
- **Templates** for faster creation
- **Advanced editing** for power users
- **Collaboration** for teams
- **Image management** for better content
- **Export/Backup** for data safety

**Recommended Start:** Begin with Analytics (Priority 1) as it provides immediate value and insights for future decisions.

**Total Estimated Timeline:** 8-10 weeks for all Phase 2 features