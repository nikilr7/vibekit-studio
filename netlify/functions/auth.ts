import jwt from "jsonwebtoken";

export function verifyToken(event: any): string | null {
  try {
    // Check Authorization header first (for API calls from frontend)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;
      return decoded.userId;
    }

    // Fallback to cookie (for httpOnly cookie)
    const cookies = event.headers.cookie || "";
    const tokenMatch = cookies.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;
    return decoded.userId;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function errorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  };
}

export function successResponse(data: any) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}
