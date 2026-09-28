// src/lib/error.lib.ts

import { ERROR_CODES, type ErrorCode } from "./error-codes.lib.js";

export class ApiError extends Error {
  constructor(
    public readonly errorCode: ErrorCode,
    public readonly message: string,
    public readonly httpStatus: number,
    public readonly details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static validation(details: { field: string; message: string }[]) {
    return new ApiError(
      ERROR_CODES.VALIDATION_ERROR,
      "Validation failed",
      400,
      details,
    );
  }

  static badRequest(
    message: string,
    details?: { field: string; message: string }[],
  ) {
    return new ApiError(ERROR_CODES.VALIDATION_ERROR, message, 400, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(ERROR_CODES.UNAUTHORIZED, message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(ERROR_CODES.FORBIDDEN, message, 403);
  }

  static forbiddenRole(message = "Action requires a specific account role") {
    return new ApiError(ERROR_CODES.FORBIDDEN_ROLE, message, 403);
  }

  static notFound(resource: string) {
    return new ApiError(ERROR_CODES.NOT_FOUND, `${resource} not found`, 404);
  }

  static conflict(message: string) {
    return new ApiError(ERROR_CODES.CONFLICT, message, 409);
  }

  static unprocessable(
    message: string,
    details?: { field: string; message: string }[],
  ) {
    return new ApiError(ERROR_CODES.UNPROCESSABLE, message, 422, details);
  }

  static rateLimited(message = "Too many requests") {
    return new ApiError(ERROR_CODES.RATE_LIMITED, message, 429);
  }

  static internal(message = "An unexpected error occurred") {
    return new ApiError(ERROR_CODES.SERVER_ERROR, message, 500);
  }
}
