import { createManager, loginManager } from "../controllers/auth.controller.js";

const schema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
          },
        },
      },
    },
  },
};
export async function authRoutes(fastify) {
  fastify.post("/login", { schema }, loginManager);
  fastify.post("/register", createManager);
}
