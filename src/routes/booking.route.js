import {
  createBooking,
  downloadBookingsData,
  getAllBookings,
  updateBookingById,
  vacateBookingById,
} from "../controllers/booking.controller.js";
import { createReviewForBooking } from "../controllers/review.controller.js";
import { createBookingValidation } from "../validations/booking.validation.js";

export async function bookingRoutes(fastify, options) {
  fastify.post(
    "/",
    { schema: { body: createBookingValidation }, onRequest: [fastify.auth] },
    createBooking(options.stripe),
  );
  fastify.get(
    "/",
    {
      //   onRequest: [fastify.auth, fastify.managerAuth],
    },
    getAllBookings,
  );

  fastify.get("/download", downloadBookingsData);

  fastify.put(
    "/:bookingId",
    { onRequest: [fastify.auth, fastify.managerAuth] },
    updateBookingById,
  );

  fastify.get(
    "/:bookingId/vacate",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            bookingId: { type: "string" },
          },
        },
      },
    },
    vacateBookingById(options.stripe),
  );

  fastify.post(
    "/:bookingId/review",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            bookingId: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["rating", "comment"],
          properties: {
            rating: { type: "number" },
            comment: { type: "string" },
            suggestions: { type: "string" },
          },
        },
      },
    },
    createReviewForBooking,
  );

  fastify.log.info("Booking routes registered...");
}
