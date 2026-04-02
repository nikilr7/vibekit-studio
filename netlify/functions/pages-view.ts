import pool from "./db";
import { errorResponse, successResponse } from "./auth";

export const handler = async (event: any) => {
  try {
    console.log("=== View Tracking Request ===");
    console.log("Path:", event.path);
    console.log("Query params:", event.queryStringParameters);
    console.log("Method:", event.httpMethod);

    if (event.httpMethod !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    // Extract slug from query parameters (from redirect)
    const slug = event.queryStringParameters?.slug;

    console.log("Slug:", slug);

    if (!slug) {
      return errorResponse(400, "Page slug required");
    }

    // Find page by slug and verify it's published
    console.log("Looking up page with slug:", slug);
    const pageResult = await pool.query(
      `SELECT id, slug, status, view_count FROM pages WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    console.log("Page lookup result rows:", pageResult.rows.length);

    if (pageResult.rows.length === 0) {
      console.log("Page not found or not published");
      // Return success even if page not found (don't expose whether page exists)
      return successResponse({ success: true, message: "View tracked" });
    }

    const page = pageResult.rows[0];
    console.log("Page found:", { id: page.id, slug: page.slug, status: page.status, view_count: page.view_count });

    // Increment view count
    console.log("Incrementing view count for page id:", page.id);
    const updateResult = await pool.query(
      `UPDATE pages SET view_count = view_count + 1 WHERE id = $1 RETURNING id, view_count`,
      [page.id]
    );

    if (updateResult.rows.length === 0) {
      console.error("Update failed - no rows returned");
      return successResponse({ success: true, message: "View tracked" });
    }

    console.log("Update result:", updateResult.rows[0]);

    return successResponse({
      success: true,
      message: "View tracked",
      view_count: updateResult.rows[0].view_count,
    });
  } catch (error: any) {
    console.error("=== View Tracking Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    // Return success to not break public page display
    return successResponse({ success: true, message: "View tracked" });
  }
};
