import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { z } from "zod/v4";
import { customAlphabet } from "nanoid";
import { sendSuccess } from "../lib/response.lib.js";

const schema = z.object({
    originalUrl: z.
        string()
        .trim()
        .min(1, 'originalUrl is required')
        .url('originalUrl must be a valid URL'),

    customCode: z
        .string()
        .min(4, 'customCode must be at least 4 characters')
        .max(20, 'customCode must be at most 20 characters')
        .regex(/^[a-zA-Z0-9-]+$/, 'customCode must be alphanumeric or hyphens only')
        .optional(),

    expiresAt: z
        .string()
        .datetime({ message: 'expiresAt must be a valid ISO 8601 datetime' })
        .refine((val) => new Date(val) > new Date(), {
        message: 'expiresAt must be in the future',
        })
        .optional(),
});

async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Body: z.infer<typeof schema> }>,
  reply: FastifyReply
) {
  const { originalUrl, customCode, expiresAt } = request.body;

  let code
  if (!customCode){
    const BASE62_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const generateCode = customAlphabet(BASE62_ALPHABET, 7)
    code = generateCode()
  } else {
    code = customCode
  }

  const link_data = await this.prisma.link.create({
    data: {
        originalUrl, code, expiresAt: expiresAt || null
    }
  })

  return sendSuccess(reply, {
  code: link_data.code,
  originalUrl: link_data.originalUrl,
  shortUrl: `https://short.ly/${link_data.code}`,
  createdAt: link_data.createdAt,
  expiresAt: link_data.expiresAt,
  clickCount: link_data.clickCount,
  isActive: link_data.isActive
}, 201);
}

export const new_link = { handler, schema: { body: schema } };