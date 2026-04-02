import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

    const result = await pool.query(
      `SELECT id, user_id, title, content, status, slug, created_at, updated_at
       FROM pages WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );

    return successResponse(result.rows);
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
