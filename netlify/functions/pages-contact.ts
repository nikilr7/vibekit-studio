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

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

function validateSubmission(data: ContactSubmission): string | null {
  // Check if at least one field has content
  const hasContent = data.name || data.email || data.message;
  if (!hasContent) {
    return "Please fill in at least one field";
  }

  // Validate name
  if (data.name) {
    const trimmedName = data.name.trim();
    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (trimmedName.length > 100) {
      return "Name must be less than 100 characters";
    }
  }

  // Validate email
  if (data.email) {
    const trimmedEmail = data.email.trim();
    if (!validateEmail(trimmedEmail)) {
      return "Invalid email address";
    }
    if (trimmedEmail.length > 255) {
      return "Email must be less than 255 characters";
    }
  }

  // Validate message
  if (data.message) {
    const trimmedMessage = data.message.trim();
    if (trimmedMessage.length < 5) {
      return "Message must be at least 5 characters";
    }
    if (trimmedMessage.length > 5000) {
      return "Message must be less than 5000 characters";
    }
  }

  return null;
}

async function checkRateLimit(ipAddress: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM contact_submissions 
       WHERE ip_address = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
      [ipAddress]
    );

    const count = parseInt(result.rows[0].count, 10);
    return count < 5; // Max 5 submissions per hour per IP
  } catch (error) {
    console.error("Rate limit check error:", error);
    return true; // Allow on error
  }
}

export const handler = async (event: any) => {
  try {
    // Extract slug from query parameters
    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      console.error("Slug not found in query parameters:", event.queryStringParameters);
      return errorResponse(400, "Page slug required");
    }

    // Parse request body
    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return errorResponse(400, "Invalid request body");
    }

    const submission: ContactSubmission = {
      name: body.name ? sanitizeInput(String(body.name)).trim() : undefined,
      email: body.email ? sanitizeInput(String(body.email)).trim() : undefined,
      message: body.message ? sanitizeInput(String(body.message)).trim() : undefined,
    };

    console.log("Contact submission received:", { slug, submission });

    // Validate submission
    const validationError = validateSubmission(submission);
    if (validationError) {
      return errorResponse(400, validationError);
    }

    // Get client IP with fallback
    const ipAddress =
      (event.headers["x-forwarded-for"] && event.headers["x-forwarded-for"].split(",")[0].trim()) ||
      event.headers["client-ip"] ||
      event.requestContext?.identity?.sourceIp ||
      "unknown";

    // Check rate limit
    const withinRateLimit = await checkRateLimit(ipAddress);
    if (!withinRateLimit) {
      return errorResponse(
        429,
        "Too many submissions. Please try again later."
      );
    }

    // Verify page exists and is published
    const pageResult = await pool.query(
      `SELECT id FROM pages WHERE slug = $1 AND status = 'published'`,
      [slug]
    );

    if (pageResult.rows.length === 0) {
      return errorResponse(404, "Page not found or not published");
    }

    const pageId = pageResult.rows[0].id;

    // Store submission
    const result = await pool.query(
      `INSERT INTO contact_submissions (page_id, name, email, message, ip_address, user_agent, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, created_at`,
      [
        pageId,
        submission.name || null,
        submission.email || null,
        submission.message || null,
        ipAddress,
        event.headers["user-agent"] || null,
      ]
    );

    return successResponse({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
      id: result.rows[0].id,
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return errorResponse(500, "Failed to submit contact form");
  }
};
