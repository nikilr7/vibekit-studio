import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

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

    const result = await pool.query(
      `UPDATE pages SET status = 'draft', updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, title, content, status, slug, created_at, updated_at`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    return successResponse(result.rows[0]);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
