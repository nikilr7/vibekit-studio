import pool from "./db";
import { errorResponse, successResponse, verifyToken } from "./auth";

export const handler = async (event: any) => {
  try {
    // Verify authentication
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

    // Extract page ID from query parameters
    const pageId = event.queryStringParameters?.pageId;
    if (!pageId) {
      return errorResponse(400, "Page ID required");
    }

    // Verify user owns the page
    const pageResult = await pool.query(
      `SELECT id FROM pages WHERE id = $1 AND user_id = $2`,
      [pageId, userId]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(403, "Access denied");
    }

    // Fetch submissions
    const result = await pool.query(
      `SELECT id, name, email, message, created_at
       FROM contact_submissions
       WHERE page_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [pageId]
    );

    return successResponse({
      submissions: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return errorResponse(500, "Failed to fetch submissions");
  }
};
