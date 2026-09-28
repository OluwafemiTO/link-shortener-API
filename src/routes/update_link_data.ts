import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { sendSuccess } from "../lib/response.lib.js";

const schema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, "originalUrl is required")
    .url("originalUrl must be a valid URL")
    .optional(),

  expiresAt: z
    .string()
    .datetime({ message: "expiresAt must be a valid ISO 8601 datetime" })
    .refine((val) => new Date(val) > new Date(), {
      message: "expiresAt must be in the future",
    })
    .optional(),

  isActive: z.boolean().optional(),
});

const query = z.object({
  code: z.string("code must be a valid string"),
});

async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: z.infer<typeof query>;
    Body: z.infer<typeof schema>;
  }>,
  reply: FastifyReply,
) {
  const { originalUrl, expiresAt, isActive } = request.body;
  const { code } = request.params;

  const link_data = await this.prisma.link.update({
    where: { code },
    data: {
      ...(originalUrl !== undefined && { originalUrl }),
      ...(expiresAt !== undefined && {
        expiresAt: expiresAt === null ? null : new Date(expiresAt),
      }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return sendSuccess(
    reply,
    {
      code: link_data.code,
      originalUrl: link_data.originalUrl,
      shortUrl: `https://short.ly/${link_data.code}`,
      createdAt: link_data.createdAt,
      expiresAt: link_data.expiresAt,
      clickCount: link_data.clickCount,
      isActive: link_data.isActive,
    },
    201,
  );
}

export const update_link_data = { handler, schema: { body: schema } };
