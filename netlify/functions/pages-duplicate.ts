import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
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

    // Get original page
    const pageResult = await pool.query(
      "SELECT * FROM pages WHERE id = $1 AND user_id = $2",
      [pageId, userId]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    const originalPage = pageResult.rows[0];

    // Generate unique slug
    let newSlug = `${originalPage.slug}-copy`;
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
        newSlug = `${originalPage.slug}-copy-${counter}`;
      }
    }

    // Create new page
    const newPageResult = await pool.query(
      `INSERT INTO pages (title, slug, content, theme, status, user_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, title, slug, status, created_at`,
      [
        `Copy of ${originalPage.title}`,
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
