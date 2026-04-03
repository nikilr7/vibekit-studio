import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const result = await pool.query(
      "SELECT id FROM pages WHERE slug = $1",
      [slug]
    );

    if (result.rows.length === 0) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

const DEFAULT_PAGE_CONTENT = {
  hero: {
    title: "Your Page Title",
    subtitle: "Create something amazing with VibeKit Studio",
    buttonText: "Get Started",
    buttonUrl: "#features",
  },
  features: {
    items: [
      {
        title: "Fast",
        description: "Lightning-quick performance optimized for speed",
      },
      {
        title: "Reliable",
        description: "Built to last with enterprise-grade stability",
      },
      {
        title: "Modern",
        description: "Latest design trends and technologies",
      },
      {
        title: "Responsive",
        description: "Perfect on mobile, tablet, and desktop",
      },
      {
        title: "Secure",
        description: "Industry-standard security and encryption",
      },
      {
        title: "Scalable",
        description: "Grows with your business needs",
      },
    ],
  },
  gallery: {
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
    ],
  },
  contact: {
    enabled: true,
    fields: {
      name: true,
      email: true,
      message: true,
    },
  },
};

export const handler = async (event: any) => {
  try {
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

    const slug = await getUniqueSlug("untitled-page");

    const result = await pool.query(
      `INSERT INTO pages (user_id, title, content, status, theme, slug, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, slug, status, theme, view_count, created_at, updated_at`,
      [
        userId,
        "Untitled Page",
        JSON.stringify(DEFAULT_PAGE_CONTENT),
        "draft",
        "minimal",
        slug,
      ]
    );

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
