import { FastifyPluginAsync } from "fastify";
import { root } from "./routes/root.js";
import { new_link } from "./routes/new_link.js";
import { call_short_link } from "./routes/call_short_link.js";
import { get_link_metadata } from "./routes/get_code_metadate.js";
import { get_links } from "./routes/get_links.js";
import { update_link_data } from "./routes/update_link_data.js";
import { delete_link } from "./routes/soft_delete_link.js";

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", root);

  fastify.get("/api/links/:code", get_link_metadata);
  fastify.get("/api/links", get_links);
  fastify.get("/:code", call_short_link);
  fastify.post("/api/links", new_link);
  fastify.patch("/api/links/:code", update_link_data);
  fastify.delete("/api/links/:code", delete_link);
};

export default routes;
