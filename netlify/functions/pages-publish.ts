import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    console.log("=== Pages Publish Request ===");
    console.log("Method:", event.httpMethod);
    console.log("Body:", event.body);

    const userId = verifyToken(event);
    console.log("User ID:", userId);

    if (!userId) {
      console.log("Error: No user ID from token");
      return errorResponse(401, "Unauthorized");
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
      console.log("Parsed body:", body);
    } catch (e) {
      console.log("Error parsing body:", e);
      return errorResponse(400, "Invalid JSON in request body");
    }

    const { id } = body;
    console.log("Page ID:", id);

    if (!id) {
      console.log("Error: No page ID provided");
      return errorResponse(400, "Page ID required");
    }

    // Verify page exists and belongs to user
    console.log("Checking page ownership for user:", userId, "page:", id);
    const pageCheck = await pool.query(
      `SELECT id, title, content, status FROM pages WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    console.log("Page check result rows:", pageCheck.rows.length);

    if (pageCheck.rows.length === 0) {
      console.log("Error: Page not found or unauthorized");
      return errorResponse(404, "Page not found or unauthorized");
    }

    const page = pageCheck.rows[0];
    console.log("Page found:", { id: page.id, title: page.title, status: page.status });

    // Validate page has required content
    if (!page.title || page.title.trim().length === 0) {
      console.log("Error: Page title is empty");
      return errorResponse(400, "Page title is required");
    }

    console.log("Validation passed, updating status to published");

    // Update status to published
    const result = await pool.query(
      `UPDATE pages SET status = 'published', updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, title, content, status, theme, slug, view_count, created_at, updated_at`,
      [id, userId]
    );

    console.log("Update result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("Error: No rows updated");
      return errorResponse(500, "Failed to publish page");
    }

    console.log("Success: Page published");

    return successResponse({
      success: true,
      status: "published",
      page: result.rows[0],
    });
  } catch (error: any) {
    console.error("=== Publish Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return errorResponse(500, error.message || "Failed to publish page");
  }
};
