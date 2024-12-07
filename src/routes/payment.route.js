import { createPaymentIntent } from "../controllers/payment.controller.js";

export default async function paymentRoutes(fastify, options) {
  // send publishable key to client
  fastify.get("/config", async (request, reply) => {
    const publishableKey = process.env.STRIPE_CLIENT_KEY || "";
    reply.status(200).send({ publishableKey });
  });

  //   create payment intent
  fastify.get("/create-payment-intent", createPaymentIntent(options.stripe));
}
