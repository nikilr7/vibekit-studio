import pool from "./db";
import { errorResponse, successResponse, verifyToken } from "./auth";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
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

    // Get original page
    const pageResult = await pool.query(
      "SELECT * FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    const originalPage = pageResult.rows[0];

    // Generate unique slug with numbering
    let newSlug = `${originalPage.slug}-1`;
    let counter = 1;
    let slugExists = true;

    while (slugExists) {
      const slugCheck = await pool.query(
        "SELECT id FROM pages WHERE slug = $1 AND user_id = $2",
        [newSlug, userId]
      );
      if (slugCheck.rows.length === 0) {
        slugExists = false;
      } else {
        counter++;
        newSlug = `${originalPage.slug}-${counter}`;
      }
    }

    // Create new page with numbered title
    const newPageResult = await pool.query(
      `INSERT INTO pages (title, slug, content, theme, status, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, slug, status, created_at`,
      [
        `${originalPage.title}-${counter}`,
        newSlug,
        originalPage.content,
        originalPage.theme,
        "draft",
        userId,
      ]
    );

    const newPage = newPageResult.rows[0];

    return successResponse({
      id: newPage.id,
      title: newPage.title,
      slug: newPage.slug,
      status: newPage.status,
      createdAt: newPage.created_at,
      message: "Page duplicated successfully",
    });
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, error.message);
  }
};
