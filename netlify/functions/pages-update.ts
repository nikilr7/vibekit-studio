import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

    const { id, title, content } = JSON.parse(event.body);
    if (!id) {
      return errorResponse(400, "Page ID required");
    }

    // Verify ownership
    const checkResult = await pool.query(
      "SELECT id FROM pages WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    const result = await pool.query(
      `UPDATE pages SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING id, user_id, title, content, status, slug, created_at, updated_at`,
      [title || null, content ? JSON.stringify(content) : null, id, userId]
    );

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
