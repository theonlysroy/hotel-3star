import fs from "node:fs";
import path from "node:path";

export async function videoRoutes(fastify) {
  fastify.get("/", async (request, reply) => {
    const inputFilePath = "../../sample.txt";
  });
}
