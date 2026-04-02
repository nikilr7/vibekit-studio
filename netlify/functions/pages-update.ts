import pool from "./db";
import { verifyToken, errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    console.log("=== Pages Update Request ===");
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

    const { id, title, content, theme } = body;
    console.log("Extracted fields - id:", id, "title:", title, "theme:", theme);

    if (!id) {
      console.log("Error: No page ID provided");
      return errorResponse(400, "Page ID required");
    }

    // Validate title if provided
    if (title !== undefined && (!title || title.trim().length === 0)) {
      console.log("Error: Empty title provided");
      return errorResponse(400, "Page title cannot be empty");
    }

    // Verify ownership
    console.log("Checking page ownership for user:", userId, "page:", id);
    const checkResult = await pool.query(
      "SELECT id FROM pages WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    console.log("Ownership check result:", checkResult.rows.length);

    if (checkResult.rows.length === 0) {
      console.log("Error: Page not found or unauthorized");
      return errorResponse(404, "Page not found or unauthorized");
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(JSON.stringify(content));
      paramCount++;
    }

    if (theme !== undefined) {
      updates.push(`theme = $${paramCount}`);
      values.push(theme);
      paramCount++;
    }

    // Always update updated_at
    updates.push(`updated_at = NOW()`);

    // Add id and user_id for WHERE clause
    values.push(id, userId);

    const query = `
      UPDATE pages 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING id, user_id, title, content, status, theme, slug, view_count, created_at, updated_at
    `;

    console.log("Update query:", query);
    console.log("Query values:", values);

    const result = await pool.query(query, values);

    console.log("Update result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("Error: No rows updated");
      return errorResponse(500, "Failed to update page");
    }

    console.log("Success: Page updated");

    return successResponse({
      success: true,
      page: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("=== Save Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return errorResponse(500, error.message || "Failed to save page");
  }
};
