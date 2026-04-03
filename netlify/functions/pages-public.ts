import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    console.log("=== Pages Public Request ===");
    console.log("Path:", event.path);
    console.log("Query params:", event.queryStringParameters);
    console.log("Raw path:", event.rawPath);

    // Extract slug from query parameters (from redirect)
    let slug = event.queryStringParameters?.slug;

    // Fallback: extract from path if not in query params
    if (!slug && event.path) {
      const match = event.path.match(/\/p\/([^/]+)/);
      if (match) {
        slug = match[1];
      }
    }

    console.log("Slug:", slug);

    if (!slug) {
      return errorResponse(400, "Page slug required");
    }

    console.log("Looking up published page with slug:", slug);

    const result = await pool.query(
      `SELECT id, title, content, theme, slug, view_count, created_at, updated_at
       FROM pages WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    console.log("Query result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("Page not found or not published");
      return errorResponse(404, "Page not found or not published");
    }

    console.log("Page found:", result.rows[0].slug);

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error("=== Pages Public Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return errorResponse(500, error.message || "Failed to fetch page");
  }
};
