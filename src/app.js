import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import ApiError from "./utils/ApiError.js";
import { roomTypeRoutes } from "./routes/roomType.route.js";
import { roomRoutes } from "./routes/room.route.js";
import { bookingRoutes } from "./routes/booking.route.js";
import { authRoutes } from "./routes/auth.routes.js";
import { maintenanceRecordRoutes } from "./routes/maintenanceRecord.route.js";
import { authDecorator, authManger } from "./decorators/auth.decorator.js";
import { reviewRoutes } from "./routes/review.route.js";
import { videoRoutes } from "./routes/video.route.js";
import graphRoutes from "./routes/graph.route.js";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import path from "node:path";
import Stripe from "stripe";
import { loginUser } from "./controllers/auth.controller.js";
import paymentRoutes from "./routes/payment.route.js";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream, readFile } from "node:fs";
import fileUploader from "./utils/fileUpload.js";
import { BASE_URL } from "../constants.js";
import { ReadableStream } from "node:stream/web";

export function buildServer() {
  const app = Fastify({
    logger: {
      file: "logs/app.log",
    },
  });

  const stripe = new Stripe(process.env.STRIPE_API_KEY);

  app.register(fastifyStatic, {
    root: path.join(BASE_URL, "tmp", "uploads"),
    prefix: "/api/v1/public",
  });
  app.register(fastifyCookie);
  app.register(fastifyCors, { origin: "*" });
  app.register(fastifyJwt, {
    secret: "Hotel-CRUD",
    cookie: {
      cookieName: "accessToken",
    },
  });
  app.register(fastifyView, {
    engine: {
      ejs,
    },
    root: path.join(import.meta.dirname, "..", "views"),
  });
  app.register(fastifyMultipart, {
    attachFieldsToBody: false,
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ApiError) {
      reply.status(error.statusCode).send({
        name: error.name,
        success: error.success,
        message: error.message,
        data: error.data,
        errors: error.errors,
      });
    } else {
      reply.status(500).send(error);
    }
  });
  // =============================================================================

  //   HOOKS
  app.decorate("auth", authDecorator);
  app.decorate("managerAuth", authManger);

  // ROUTES register
  app.register(roomTypeRoutes, { prefix: "/api/v1/room-type" });
  app.register(roomRoutes, { prefix: "/api/v1/room" });
  app.register(bookingRoutes, { prefix: "/api/v1/booking", stripe });
  app.register(maintenanceRecordRoutes, {
    prefix: "/api/v1/maintenance-record",
  });
  app.register(authRoutes, { prefix: "/auth/manager" });
  app.register(reviewRoutes, { prefix: "/api/v1/review" });
  app.register(videoRoutes, { prefix: "/api/v1/video" });
  app.register(graphRoutes, { prefix: "/api/v1/graph/" });
  app.register(paymentRoutes, { prefix: "/api/v1/p", stripe });
  app.post("/api/v1/u/login", loginUser);
  // =============================================================================

  //   HEALTH-CHECK route
  app.get("/api/v1/health", async (request, reply) => {
    reply.send({ msg: "version 1 APIs running..." });
  });

  app.get("/", (request, reply) => {
    reply.send({ API_URL: `${process.env.DOMAIN}:${process.env.PORT}/api/v1` });
  });

  return app;
}
