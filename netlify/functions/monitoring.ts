// Production Error Handling & Monitoring Utilities
// File: netlify/functions/monitoring.ts

import * as Sentry from "@sentry/node";

// Initialize Sentry for error tracking
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "production",
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
  });
}

// Logger utility
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || "");
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error || new Error(message));
    }
  },
  debug: (message: string, data?: any) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || "");
    }
  },
};

// Error response formatter
export const errorResponse = (statusCode: number, message: string, details?: any) => {
  const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  logger.error(message, { statusCode, errorId, details });
  
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "X-Error-ID": errorId,
    },
    body: JSON.stringify({
      error: true,
      message,
      errorId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && { details }),
    }),
  };
};

// Success response formatter
export const successResponse = (data: any, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }),
  };
};

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

// Request validation
export const validateRequest = (
  event: any,
  requiredFields: string[] = []
): { valid: boolean; error?: string } => {
  if (!event.body) {
    return { valid: false, error: "Request body is required" };
  }

  try {
    const body = JSON.parse(event.body);
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid JSON in request body" };
  }
};

// Performance monitoring
export const measurePerformance = async (
  name: string,
  fn: () => Promise<any>
): Promise<any> => {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    logger.debug(`${name} completed in ${duration}ms`);
    
    if (duration > 5000) {
      logger.warn(`${name} took longer than 5s: ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${name} failed after ${duration}ms`, error);
    throw error;
  }
};

// Database error handler
export const handleDatabaseError = (error: any) => {
  logger.error("Database error", error);

  if (error.code === "ECONNREFUSED") {
    return errorResponse(503, "Database connection failed. Please try again later.");
  }

  if (error.code === "23505") {
    // Unique constraint violation
    return errorResponse(409, "This resource already exists.");
  }

  if (error.code === "23503") {
    // Foreign key violation
    return errorResponse(400, "Invalid reference to related resource.");
  }

  if (error.code === "42P01") {
    // Table does not exist
    return errorResponse(500, "Database schema error. Please contact support.");
  }

  return errorResponse(500, "Database error. Please try again later.");
};

// API error handler
export const handleAPIError = (error: any) => {
  logger.error("API error", error);

  if (error.message.includes("timeout")) {
    return errorResponse(504, "Request timeout. Please try again.");
  }

  if (error.message.includes("ECONNREFUSED")) {
    return errorResponse(503, "Service unavailable. Please try again later.");
  }

  if (error.response?.status === 401) {
    return errorResponse(401, "Unauthorized. Please login again.");
  }

  if (error.response?.status === 403) {
    return errorResponse(403, "Access denied.");
  }

  if (error.response?.status === 404) {
    return errorResponse(404, "Resource not found.");
  }

  return errorResponse(500, "An error occurred. Please try again later.");
};

// Health check
export const healthCheck = async () => {
  try {
    // Check database connection
    const pool = require("./db").default;
    await pool.query("SELECT 1");

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    };
  } catch (error) {
    logger.error("Health check failed", error);
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Graceful shutdown
export const setupGracefulShutdown = () => {
  const signals = ["SIGTERM", "SIGINT"];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      try {
        // Close database connections
        const pool = require("./db").default;
        await pool.end();
        logger.info("Database connections closed");

        // Flush Sentry
        if (process.env.SENTRY_DSN) {
          await Sentry.close(2000);
          logger.info("Sentry flushed");
        }

        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown", error);
        process.exit(1);
      }
    });
  });
};

// Export Sentry for use in functions
export { Sentry };