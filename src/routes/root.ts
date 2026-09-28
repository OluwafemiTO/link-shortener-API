import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { sendSuccess } from "../lib/response.lib.js";

async function handler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  
  return sendSuccess(reply, {root: true});
}

export const root = { handler };