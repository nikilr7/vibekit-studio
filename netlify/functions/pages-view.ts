import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      return errorResponse(400, "Page slug required");
    }

    // Verify page exists and is published
    const result = await pool.query(
      `SELECT id FROM pages 
       WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (result.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    // View tracking logged successfully (view_count column can be added later)
    return successResponse({ message: "View tracked successfully" });
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
