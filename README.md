# VibeKit Studio

A modern, full-stack web application for creating, managing, and publishing mini websites with a beautiful dark-themed dashboard and real-time page editor.

---

## 🌐 Live Demo

**[View Live Demo](https://glistening-blancmange-271a4c.netlify.app/)**

---

## 🔑 Key Features

- **Authentication** - JWT-based login/signup with secure password hashing
- **Page Builder** - Real-time editor with live preview
- **Publish/Unpublish** - Control page visibility with one click
- **Public Page Sharing** - Share pages via unique slug URLs
- **Contact Forms** - Collect submissions from page visitors
- **Dashboard Analytics** - Track views, pages, and statistics
- **Page Duplication** - Clone pages to save time
- **Theme System** - Extensible theme support

---

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Chakra UI** - Accessible component library
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Reliable database (Neon)
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Netlify Functions** - Serverless backend implementation

### Deployment
- **Netlify** - Hosting & serverless functions
- **Neon** - PostgreSQL database hosting

---

## 📸 Screenshots

### Dashboard View
![Dashboard](https://via.placeholder.com/800x500?text=Dashboard+View)

### Page Editor
![Page Editor](https://via.placeholder.com/800x500?text=Page+Editor)

### Public Page
![Public Page](https://via.placeholder.com/800x500?text=Public+Page)

---

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Git

---

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd vibekit-studio
```

### 2. Install Dependencies

**Root level:**
```bash
npm install
```

**Client level:**
```bash
cd client
npm install
cd ..
```

### 3. Environment Setup

Create `.env` file in root directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your_secure_secret_key_here
```

**For development**, you can use Neon's free PostgreSQL:
1. Sign up at [neon.tech](https://neon.tech)
2. Create a project and copy the connection string
3. Paste into `DATABASE_URL`

### 4. Database Migration

Run migrations to set up tables:
```bash
npm run build
```

Or manually trigger via Netlify function:
```bash
curl http://localhost:8888/.netlify/functions/migrate
```

---

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Backend (Netlify Functions):**
```bash
npm run dev
```

**Terminal 2 - Frontend (Client):**
```bash
cd client
npm run dev
```

Access the app at `http://localhost:5173`

### Production Build

```bash
npm run build
```

This builds the client and prepares for deployment.

---

## 📁 Project Structure

```
vibekit-studio/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (Dashboard, Editor, etc.)
│   │   ├── components/       # Reusable components
│   │   ├── api/              # API client functions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── theme/            # Chakra UI theme config
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── netlify/functions/        # Serverless backend functions
│   ├── auth.ts              # Authentication
│   ├── pages-*.ts           # Page CRUD operations
│   ├── pages-contact.ts     # Contact form handling
│   └── migrate.ts           # Database migrations
├── .env                      # Environment variables
├── package.json
└── netlify.toml             # Netlify configuration
```

---

## 🔌 API Endpoints

### Authentication
- `POST /auth` - Register user
- `POST /login` - Login user

### Pages
- `GET /pages` - List all pages
- `POST /pages-create` - Create page
- `GET /pages-get?id=<id>` - Get page details
- `POST /pages-update` - Update page
- `POST /pages-delete` - Delete page
- `POST /pages-publish` - Publish page
- `POST /pages-unpublish` - Unpublish page
- `POST /pages-duplicate` - Duplicate page

### Public
- `GET /pages-public?slug=<slug>` - Get published page
- `POST /pages-view` - Track page view
- `POST /pages-contact` - Submit contact form
- `GET /pages-submissions?pageId=<id>` - Get contact submissions

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Pages Table
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  theme VARCHAR DEFAULT 'minimal',
  status VARCHAR DEFAULT 'draft',
  content JSONB,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy

Netlify will automatically:
- Build the client
- Deploy serverless functions
- Set up CI/CD

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User signup/login
- [ ] Create new page
- [ ] Edit page content
- [ ] Publish/unpublish page
- [ ] View published page
- [ ] Submit contact form
- [ ] View page statistics
- [ ] Duplicate page
- [ ] Delete page

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

---

## 🐛 Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check network access in Neon dashboard
- Ensure SSL mode is enabled

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

### Port Already in Use
```bash
# Change Vite port
cd client
npm run dev -- --port 3000
```

---

## 📚 Documentation

- [Dashboard Implementation](./DASHBOARD_IMPLEMENTATION.md)
- [Page Editor Guide](./PAGE_EDITOR_GUIDE.md)
- [Public Page Architecture](./PUBLIC_PAGE_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

## 📄 License

MIT

---

## 👤 Author

**Nikil R**

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the development team.
