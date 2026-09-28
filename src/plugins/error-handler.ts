// src/plugins/error-handler.ts

import fp from "fastify-plugin";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ApiError } from "../lib/error.lib.js";
import { ERROR_CODES, errorResponse } from "../lib/index.js";
import { errorCodes } from "fastify";

export default fp(
  async (fastify) => {
    fastify.setErrorHandler((error, request, reply) => {
      // 1. Our own AppError
      if (error instanceof ApiError) {
        reply
          .status(error.httpStatus)
          .send(
            errorResponse(
              error.httpStatus,
              error.errorCode,
              error.message,
              error.details,
            ),
          );
        return;
      }

      // 2. Zod schema validation errors
      if (hasZodFastifySchemaValidationErrors(error)) {
        const details = error.validation.map((e) => ({
          field: e.instancePath.replace("/", ""),
          message: e.message ?? "Invalid value",
        }));
        reply
          .status(400)
          .send(
            errorResponse(
              400,
              ERROR_CODES.VALIDATION_ERROR,
              "Validation failed",
              details,
            ),
          );
        return;
      }

      // 3. Malformed JSON body
      if (error instanceof errorCodes.FST_ERR_CTP_INVALID_JSON_BODY) {
        reply
          .status(400)
          .send(
            errorResponse(
              400,
              ERROR_CODES.VALIDATION_ERROR,
              "Malformed JSON body",
            ),
          );
        return;
      }

      // 4. Unhandled
      request.log.error(error);
      reply
        .status(500)
        .send(
          errorResponse(
            500,
            ERROR_CODES.SERVER_ERROR,
            "An unexpected error occurred",
          ),
        );
    });
  },
  { name: "error-handler" },
);
