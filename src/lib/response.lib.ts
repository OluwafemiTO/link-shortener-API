// src/lib/response.lib.ts

import type { FastifyReply } from "fastify";

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    status: number;
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export function sendSuccess<T>(reply: FastifyReply, data: T, statusCode = 200) {
  return reply
    .status(statusCode)
    .send({ success: true, data } satisfies SuccessResponse<T>);
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: { field: string; message: string }[],
): ErrorResponse {
  return { success: false, error: { status, code, message, details } };
}
