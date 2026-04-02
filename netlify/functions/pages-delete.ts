import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "DELETE") {
      return errorResponse(405, "Method not allowed");
    }

    const pageId = event.pathParameters?.id;
    const token = event.headers.authorization?.split(" ")[1];

    if (!pageId || !token) {
      return errorResponse(400, "Page ID and authorization required");
    }

    // Verify user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE token = $1",
      [token]
    );

    if (userResult.rows.length === 0) {
      return errorResponse(401, "Unauthorized");
    }

    const userId = userResult.rows[0].id;

    // Verify page belongs to user
    const pageResult = await pool.query(
      "SELECT id FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    // Delete page
    await pool.query(
      "DELETE FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId]
    );

    return successResponse({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
