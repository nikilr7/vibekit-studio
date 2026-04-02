import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HStack,
  Text,
  Spinner,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import { CreatePageDialog } from "../components/CreatePageDialog";
import { PageDetails } from "../components/PageDetails";
import type { Page } from "../api/pages";
import { pagesAPI } from "../api/pages";
import { formatViewCount } from "../utils/formatters";

// ─── Inline style injection ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }

  body {
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
  }

  .dash-root {
    min-height: 100vh;
    background: #0a0a0f;
    background-image:
      radial-gradient(ellipse 80% 40% at 20% -10%, rgba(99,102,241,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(236,72,153,0.08) 0%, transparent 60%);
    font-family: 'Sora', sans-serif;
    color: #e8e8f0;
  }

  /* ── Top nav bar ── */
  .dash-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(10,10,15,0.8);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .dash-nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dash-wordmark {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
  }

  .dash-wordmark span {
    color: #818cf8;
  }

  .dash-logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: rgba(255,255,255,0.5);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }

  .dash-logout-btn:hover {
    border-color: rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.04);
  }

  /* ── Main content ── */
  .dash-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 32px 80px;
  }

  /* ── Hero header ── */
  .dash-hero {
    margin-bottom: 48px;
  }

  .dash-hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #818cf8;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dash-hero-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: #818cf8;
  }

  .dash-hero-title {
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .dash-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dash-hero-sub {
    font-size: 15px;
    font-weight: 400;
    color: rgba(232,232,240,0.45);
    letter-spacing: 0.01em;
  }

  /* ── Stats bar ── */
  .dash-stats {
    display: flex;
    gap: 1px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 40px;
  }

  .dash-stat {
    flex: 1;
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    transition: background 0.2s;
  }

  .dash-stat:hover {
    background: rgba(255,255,255,0.04);
  }

  .dash-stat-value {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1;
    margin-bottom: 4px;
  }

  .dash-stat-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(232,232,240,0.35);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* ── Toolbar ── */
  .dash-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dash-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  /* ── Create button ── */
  .dash-create-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 24px rgba(99,102,241,0.3);
    position: relative;
    overflow: hidden;
  }

  .dash-create-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .dash-create-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(99,102,241,0.45);
  }

  .dash-create-btn:hover::before {
    opacity: 1;
  }

  .dash-create-btn:active {
    transform: translateY(0);
  }

  .dash-create-btn-icon {
    width: 18px;
    height: 18px;
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
  }

  /* ── Empty state ── */
  .dash-empty {
    background: rgba(255,255,255,0.02);
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 80px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .dash-empty-icon {
    width: 72px;
    height: 72px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 8px;
  }

  .dash-empty-title {
    font-size: 22px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: -0.02em;
  }

  .dash-empty-sub {
    font-size: 14px;
    color: rgba(232,232,240,0.35);
    max-width: 300px;
    line-height: 1.6;
  }

  /* ── Page cards grid ── */
  .dash-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .dash-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    .dash-grid { grid-template-columns: 1fr; }
    .dash-main { padding: 32px 16px 60px; }
    .dash-nav-inner { padding: 0 16px; }
    .dash-stats { flex-direction: column; }
  }

  /* ── Page card ── */
  .page-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    gap: 18px;
    cursor: default;
    position: relative;
    overflow: visible;
  }

  .page-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(129,140,248,0.4), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .page-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(129,140,248,0.25);
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .page-card:hover::before {
    opacity: 1;
  }

  /* Card header */
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .card-title-block {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: rgba(255,255,255,0.92);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
    line-height: 1.2;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .card-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .card-badge.published {
    background: rgba(16,185,129,0.12);
    color: #34d399;
    border: 1px solid rgba(52,211,153,0.2);
  }

  .card-badge.draft {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .card-badge::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .card-date {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    font-family: 'JetBrains Mono', monospace;
  }

  /* Card slug */
  .card-slug {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 9px 12px;
    overflow: hidden;
  }

  .card-slug-prefix {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.2);
    flex-shrink: 0;
  }

  .card-slug-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  /* Views pill */
  .card-views {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #a5b4fc;
  }

  .card-views-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: #818cf8;
  }

  /* Card actions */
  .card-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: auto;
    overflow: visible;
    position: relative;
    z-index: 10;
  }

  .card-btn {
    flex: 1;
    padding: 9px 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.55);
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: center;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .card-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.9);
  }

  .card-btn.primary {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.25);
    color: #a5b4fc;
  }

  .card-btn.primary:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.4);
    color: #c7d2fe;
  }

  .card-menu-btn {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: all 0.18s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .card-menu-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.8);
  }

  /* ── Dialog overrides ── */
  [data-scope="dialog"][data-part="backdrop"] {
    background: rgba(0,0,0,0.7) !important;
    backdrop-filter: blur(8px) !important;
  }

  [data-scope="dialog"][data-part="content"] {
    background: #13131a !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 20px !important;
    color: #e8e8f0 !important;
  }

  /* ── Menu overrides ── */
  [data-scope="menu"][data-part="content"] {
    background: #1a1a24 !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 12px !important;
    padding: 6px !important;
    box-shadow: 0 16px 48px rgba(0,0,0,0.6) !important;
    pointer-events: auto !important;
  }

  [data-scope="menu"][data-part="item"] {
    border-radius: 8px !important;
    font-family: 'Sora', sans-serif !important;
    font-size: 13px !important;
    color: rgba(255,255,255,0.7) !important;
    padding: 9px 14px !important;
    transition: all 0.15s !important;
    pointer-events: auto !important;
  }

  [data-scope="menu"][data-part="item"]:hover {
    background: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.95) !important;
  }

  [data-scope="menu"][data-part="item"][data-highlighted] {
    background: rgba(99,102,241,0.15) !important;
    color: #a5b4fc !important;
  }

  /* ── Spinner override ── */
  .dash-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 80px 0;
  }

  .dash-loading-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase;
  }
`;

// ─── Inject styles ──────────────────────────────────────────────────────────
if (typeof document !== "undefined") {
  const styleId = "dash-premium-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.list();
      setPages(data || []);
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to load pages"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (pageId: string) => {
    alert("Success: Page created successfully");
    navigate(`/app/pages/${pageId}`);
  };

  const handlePublish = async (id: string) => {
    try {
      const updated = await pagesAPI.publish(id);
      setPages(pages.map((p) => (p.id === id ? updated : p)));
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to publish"}`);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const updated = await pagesAPI.unpublish(id);
      setPages(pages.map((p) => (p.id === id ? updated : p)));
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to unpublish"}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await pagesAPI.duplicate(id);
      await fetchPages();
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to duplicate"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await pagesAPI.delete(id);
      setPages(pages.filter((p) => p.id !== id));
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to delete"}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Derived stats
  const totalPages = pages.length;
  const publishedCount = pages.filter((p) => p.status === "published").length;
  const draftCount = pages.filter((p) => p.status === "draft").length;
  const totalViews = pages.reduce((sum, p) => sum + (p.view_count || 0), 0);

  return (
    <div className="dash-root">
      {/* ── Nav ── */}
      <nav className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-wordmark">
            Page<span>Craft</span>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="dash-main">
        {/* Hero */}
        <div className="dash-hero">
          <div className="dash-hero-eyebrow">Content Manager</div>
          <h1 className="dash-hero-title">
            Your <em>Pages</em>
          </h1>
          <p className="dash-hero-sub">Design, publish, and track your mini websites — all in one place.</p>
        </div>

        {/* Stats bar */}
        {!loading && pages.length > 0 && (
          <div className="dash-stats">
            <div className="dash-stat">
              <div className="dash-stat-value">{totalPages}</div>
              <div className="dash-stat-label">Total Pages</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-value">{publishedCount}</div>
              <div className="dash-stat-label">Published</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-value">{draftCount}</div>
              <div className="dash-stat-label">Drafts</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-value">{formatViewCount(totalViews)}</div>
              <div className="dash-stat-label">Total Views</div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="dash-toolbar">
          <div className="dash-section-label">
            {loading ? "Loading..." : `${totalPages} page${totalPages !== 1 ? "s" : ""}`}
          </div>
          <button className="dash-create-btn" onClick={() => setDialogOpen(true)}>
            <div className="dash-create-btn-icon">+</div>
            New Page
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="dash-loading">
            <Spinner size="lg" color="indigo.400" borderWidth="2px" />
            <div className="dash-loading-text">Loading pages…</div>
          </div>
        ) : pages.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty-icon">✦</div>
            <div className="dash-empty-title">Nothing here yet</div>
            <div className="dash-empty-sub">Create your first page and start building your presence online.</div>
            <button className="dash-create-btn" onClick={() => setDialogOpen(true)} style={{ marginTop: 8 }}>
              <div className="dash-create-btn-icon">+</div>
              Create First Page
            </button>
          </div>
        ) : (
          <div className="dash-grid">
            {pages.map((page) => (
              <div className="page-card" key={page.id}>
                {/* Header */}
                <div className="card-header">
                  <div className="card-title-block">
                    <div className="card-title" title={page.title}>{page.title}</div>
                    <div className="card-meta">
                      <span className={`card-badge ${page.status === "published" ? "published" : "draft"}`}>
                        {page.status === "published" ? "Live" : "Draft"}
                      </span>
                      <span className="card-date">{formatDate(page.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Slug */}
                <div className="card-slug">
                  <span className="card-slug-prefix">p/</span>
                  <span className="card-slug-value" title={page.slug}>{page.slug}</span>
                </div>

                {/* Views */}
                {page.status === "published" && (
                  <div className="card-views">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span className="card-views-count">{formatViewCount(page.view_count || 0)}</span>
                    <span style={{ fontSize: 12, color: "rgba(165,180,252,0.6)" }}>views</span>
                  </div>
                )}

                {/* Actions */}
                <div className="card-actions">
                  <button className="card-btn" onClick={() => setSelectedPage(page)}>Details</button>
                  <button className="card-btn primary" onClick={() => navigate(`/app/pages/${page.id}`)}>Edit</button>
                  {page.status === "published" && (
                    <button
                      className="card-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/p/${page.slug}`);
                        alert("URL copied!");
                      }}
                    >
                      Share
                    </button>
                  )}

                  {/* ⋮ Menu */}
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <button className="card-menu-btn" aria-label="More options">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="19" r="1.5"/>
                        </svg>
                      </button>
                    </MenuTrigger>
                    <MenuContent zIndex={9999} minW="180px">
                        {page.status === "published" && (
                          <MenuItem value="view" onClick={() => window.open(`/p/${page.slug}`, "_blank")}>
                            ↗ View Live Page
                          </MenuItem>
                        )}
                        {page.status === "draft" ? (
                          <MenuItem value="publish" onClick={() => handlePublish(page.id)}>
                            ⬆ Publish
                          </MenuItem>
                        ) : (
                          <MenuItem value="unpublish" onClick={() => handleUnpublish(page.id)}>
                            ⬇ Unpublish
                          </MenuItem>
                        )}
                        <MenuItem value="duplicate" onClick={() => handleDuplicate(page.id)}>
                          ⊞ Duplicate
                        </MenuItem>
                        <MenuItem
                          value="delete"
                          onClick={() => handleDelete(page.id)}
                          style={{ color: "#f87171" }}
                        >
                          ✕ Delete
                        </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Create Dialog ── */}
      <CreatePageDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* ── Page Details Dialog ── */}
      <DialogRoot
        open={!!selectedPage}
        onOpenChange={(details: any) => !details.open && setSelectedPage(null)}
      >
        <DialogContent
          maxW="4xl"
          w="95vw"
          maxH="90vh"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={9999}
        >
          <DialogHeader pb={2}>
            <HStack justify="space-between" w="full">
              <Text
                fontSize="lg"
                fontWeight="700"
                letterSpacing="-0.02em"
                style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Sora', sans-serif" }}
              >
                Page Details
              </Text>
              <DialogCloseTrigger />
            </HStack>
          </DialogHeader>
          <DialogBody pb={6} maxH="calc(90vh - 100px)" overflowY="auto">
            {selectedPage && (
              <PageDetails
                page={selectedPage}
                onViewPublic={() => window.open(`/p/${selectedPage.slug}`, "_blank")}
              />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
