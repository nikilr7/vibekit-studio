import pool from "./db";
import { errorResponse, successResponse } from "./auth";

interface ContactSubmission {
  name?: string;
  email?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateSubmission(data: ContactSubmission): string | null {
  if (data.name && data.name.trim().length === 0) {
    return "Name cannot be empty";
  }
  if (data.name && data.name.length > 100) {
    return "Name must be less than 100 characters";
  }
  if (data.email && !validateEmail(data.email)) {
    return "Invalid email address";
  }
  if (data.message && data.message.trim().length === 0) {
    return "Message cannot be empty";
  }
  if (data.message && data.message.length > 5000) {
    return "Message must be less than 5000 characters";
  }
  return null;
}

export const handler = async (event: any) => {
  try {
    if (event.httpMethod !== "POST") {
      return errorResponse(405, "Method not allowed");
    }

    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      return errorResponse(400, "Page slug required");
    }

    const body = JSON.parse(event.body || "{}");
    const submission: ContactSubmission = {
      name: body.name?.trim(),
      email: body.email?.trim(),
      message: body.message?.trim(),
    };

    // Validate submission
    const validationError = validateSubmission(submission);
    if (validationError) {
      return errorResponse(400, validationError);
    }

    // Verify page exists and is published
    const pageResult = await pool.query(
      `SELECT id FROM pages WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(404, "Page not found");
    }

    const pageId = pageResult.rows[0].id;

    // Store submission
    const result = await pool.query(
      `INSERT INTO contact_submissions (page_id, name, email, message, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, created_at`,
      [pageId, submission.name || null, submission.email || null, submission.message || null]
    );

    return successResponse({
      id: result.rows[0].id,
      message: "Thank you for your message. We'll get back to you soon!",
    });
  } catch (error: any) {
    console.error(error);
    return errorResponse(500, "Failed to submit contact form");
  }
};
