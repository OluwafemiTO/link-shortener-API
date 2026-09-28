import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { ApiError } from "../lib/error.lib.js";

const schema = z.object({
  code: z.string("code must be a valid string"),
});

async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: z.infer<typeof schema> }>,
  reply: FastifyReply,
) {
  const { code } = request.params;

  // Try cache first
  let link = null;
  const cached = await this.redis.get(`link:${code}`);
  if (cached) {
    console.log('cached')
    link = JSON.parse(cached);
  } else {
    console.log('not cached')

    link = await this.prisma.link.findUnique({ where: { code } });
    if (link) {
      await this.redis.set(`link:${code}`, JSON.stringify(link), "EX", 3600);
    }
  }
  // Not found
  if (!link) {
    throw ApiError.notFound("link");
  }

  // Disabled
  if (!link.isActive) {
    return reply.code(410).send({ error: "Link is disabled" });
  }

  // Expired
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return reply.code(410).send({ error: "Link has expired" });
  }

  return reply.code(302).redirect(link.originalUrl);
}

export const call_short_link = { handler, schema: { params: schema } };
