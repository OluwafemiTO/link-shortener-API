// src/plugins/env.ts

import fp from "fastify-plugin";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.url(),
  RATE_LIMIT_REDIRECT_MAX: z.coerce.number(),
  RATE_LIMIT_REDIRECT_WINDOW_MS: z.coerce.number(),
  RATE_LIMIT_CREATE_MAX: z.coerce.number(),
  RATE_LIMIT_CREATE_WINDOW_MS: z.coerce.number()
});

export type Config = z.infer<typeof schema>;

export default fp(
  async (fastify) => {
    const parsed = schema.safeParse(process.env);

    if (!parsed.success) {
      console.error("Invalid environment variables:");
      parsed.error.issues.forEach((issue) => {
        console.error(`   ${issue.path.join(".")}: ${issue.message}`);
      });
      process.exit(1);
    }

    fastify.decorate("config", parsed.data);
  },
  { name: "env" },
);

declare module "fastify" {
  export interface FastifyInstance {
    config: Config;
  }
}
