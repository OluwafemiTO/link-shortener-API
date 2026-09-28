import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { sendSuccess } from "../lib/response.lib.js";
import { ApiError } from "../lib/error.lib.js";

const schema = z.object({
    code: z.string("code must be a valid string")
});

async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: z.infer<typeof schema> }>,
  reply: FastifyReply
) {

    const { code } = request.params;

    const link_data = await this.prisma.link.findUnique({where: {code}})

    if (!link_data) {throw ApiError.notFound("link")}
    
  return sendSuccess(reply, {
  code: link_data.code,
  originalUrl: link_data.originalUrl,
  shortUrl: `https://short.ly/${link_data.code}`,
  createdAt: link_data.createdAt,
  expiresAt: link_data.expiresAt,
  clickCount: link_data.clickCount,
  isActive: link_data.isActive
});
}

export const get_link_metadata = { handler, schema: { params: schema }  };