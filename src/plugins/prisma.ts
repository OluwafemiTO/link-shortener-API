import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import fp from "fastify-plugin";

export default fp(
  async (fastify) => {

    const adapter = new PrismaPg({ connectionString: fastify.config.DATABASE_URL })

    const prisma = new PrismaClient({ adapter });

    fastify.decorate("prisma", prisma);
  },
  {
    name: "db",
    dependencies: ["env"],
  },
);

declare module "fastify" {
  export interface FastifyInstance {
    prisma: PrismaClient;
  }
}
