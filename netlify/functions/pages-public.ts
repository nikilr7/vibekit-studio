import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      return errorResponse(400, "Page slug required");
    }

    const result = await pool.query(
      `SELECT id, title, content, theme, slug, created_at, updated_at
       FROM pages WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(404, "Page not found or not published");
    }

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};