import { NextResponse } from "next/server";
import { env } from "./env";

interface ApiResponse<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ------------------------------------------------------------------

/**
 * Creates a standardized error response for Next.js API Routes.
 * @param statusCode The HTTP status code (e.g., 400, 404, 500).
 * @param error The original error object or string for logging/debugging.
 * @param publicMessage The safe, user-facing message to return in the response body.
 * @returns A NextResponse object with the error payload.
 */

export function errorResponse(
  statusCode: number,
  error: Error | string | any,
  publicMessage: string,
): NextResponse<ApiResponse<null>> {
  if (env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  // 2. Return the NextResponse object
  return NextResponse.json(
    {
      ok: false,
      message: publicMessage,
      error: publicMessage, // Use publicMessage for the error field
      data: null,
    } as ApiResponse<null>,
    {
      status: statusCode,
    },
  );
}

// ------------------------------------------------------------------

/**
 * Creates a standardized success response for Next.js API Routes.
 * @param statusCode The HTTP status code (e.g., 200, 201).
 * @param message The user-facing success message.
 * @param data Optional payload to include in the response body.
 * @returns A NextResponse object with the success payload.
 */

export function successResponse<T>(
  statusCode: number,
  message: string,
  data?: T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      ok: true,
      message,
      data: data || undefined, // Include data payload if provided
    } as ApiResponse<T>,
    {
      status: statusCode,
    },
  );
}
