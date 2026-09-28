import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { sendSuccess } from "../lib/response.lib.js";

const schema = z.object({
  page: z.coerce
    .number()
    .int("page must be an integer")
    .min(1, "page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .int("limit must be an integer")
    .min(1, "limit must be at least 1")
    .max(100, "limit must be at most 100")
    .default(20),

  sortBy: z.enum(["createdAt", "clickCount"]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Querystring: z.infer<typeof schema> }>,
  reply: FastifyReply,
) {
  const { page, limit, sortBy, order } = request.query;

  const [link_data, total] = await Promise.all([
    this.prisma.link.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    this.prisma.link.count(),
  ]);

  return sendSuccess(reply, {
    link_data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export const get_links = { handler, schema: { querystring: schema } };
