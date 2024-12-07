import {
  getBookingsCreationGraphData,
  getEarningsGraphData,
} from "../controllers/graph.controller.js";

export default async function graphRoutes(fastify) {
  fastify.get(
    "/earnings-graph",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              x_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "string" },
              },
              y_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "number" },
              },
            },
          },
        },
      },
      onRequest: [fastify.auth],
    },
    getEarningsGraphData,
  );
  fastify.get(
    "/bookings-creation-graph",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              x_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "string" },
              },
              y_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "number" },
              },
            },
          },
        },
      },
      onRequest: [fastify.auth],
    },
    getBookingsCreationGraphData,
  );
  fastify.get(
    "/bookings-vacation-graph",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              x_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "string" },
              },
              y_axis: {
                type: "array",
                maxItems: 12,
                items: { type: "number" },
              },
            },
          },
        },
      },
      onRequest: [fastify.auth],
    },
    getBookingsCreationGraphData,
  );
}
