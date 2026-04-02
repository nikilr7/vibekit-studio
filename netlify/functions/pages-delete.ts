import pool from "./db";
import { errorResponse, successResponse, verifyToken } from "./auth";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "DELETE") {
      return errorResponse(405, "Method not allowed");
    }

    // Get pageId from body (sent by frontend)
    let body: any = {};
    if (event.body) {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    }

    const pageId = body.id || event.pathParameters?.id;

    if (!pageId) {
      return errorResponse(400, "Page ID required");
    }

    // Verify user with JWT token
    const userId = verifyToken(event);
    if (!userId) {
      return errorResponse(401, "Unauthorized");
    }

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
