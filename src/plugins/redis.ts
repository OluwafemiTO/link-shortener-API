import fastifyRedis from "@fastify/redis";
import fp from "fastify-plugin";

export default fp(
  async (fastify) => {
    await fastify.register(fastifyRedis, {
      url: process.env.REDIS_URL || "redis://localhost:6379",
      closeClient: true, // auto-close on server shutdown
    });
  },
  { name: "redis" },
);
