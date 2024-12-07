import {
  deleteReviewById,
  getAverageRating,
} from "../controllers/review.controller.js";

export async function reviewRoutes(fastify) {
  fastify.delete(
    "/:reviewId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            reviewId: { type: "string" },
          },
        },
      },
    },
    deleteReviewById,
  );

  fastify.get("/avg-rating", { onRequest: [fastify.auth] }, getAverageRating);
}
