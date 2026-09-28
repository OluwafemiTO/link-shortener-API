import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { sendSuccess } from "../lib/response.lib.js";
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

  const link_data = await this.prisma.link.update({
    where: { code },
    data: { isActive: false },
  });

  if (!link_data) {
    throw ApiError.notFound("link");
  }

  return sendSuccess(reply, {}, 204);
}

export const delete_link = { handler, schema: { params: schema } };
