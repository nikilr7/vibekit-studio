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

async function getUniqueSlug(baseSlug: string, userId: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const result = await pool.query(
      "SELECT id FROM pages WHERE slug = $1 AND user_id = $2",
      [slug, userId]
    );

    if (result.rows.length === 0) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export const handler = async (event: any) => {
  try {
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

    const { id } = JSON.parse(event.body);
    if (!id) {
      return errorResponse(400, "Page ID required");
    }

    // Fetch original page
    const originalResult = await pool.query(
      "SELECT title, content, theme FROM pages WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (originalResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    const original = originalResult.rows[0];
    const newTitle = `${original.title} (Copy)`;
    const baseSlug = generateSlug(newTitle);
    const newSlug = await getUniqueSlug(baseSlug, userId);

    const result = await pool.query(
      `INSERT INTO pages (user_id, title, content, status, theme, slug, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, slug, status, theme`,
      [userId, newTitle, original.content, "draft", original.theme, newSlug]
    );

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
