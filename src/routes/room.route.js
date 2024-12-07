import {
  createRoom,
  deleteRoomById,
  getAllRooms,
  updateRoomById,
  uploadRoomImage,
  vacateRoom,
} from "../controllers/room.controller.js";
import {
  createGeneralizedRoomTimeline,
  createRoomTimeline,
} from "../controllers/roomTimeline.controller.js";
import { getRoomSerialization } from "../serializatons/room.serialization.js";
import fileUploader from "../utils/fileUpload.js";

export async function roomRoutes(fastify) {
  fastify.get("/", { schema: { response: getRoomSerialization } }, getAllRooms);
  fastify.post("/", createRoom);
  fastify.put("/:roomId", updateRoomById);
  fastify.delete("/:roomId", deleteRoomById);
  fastify.get("/vacate", vacateRoom);
  fastify.get("/timeline", createRoomTimeline);
  fastify.get(
    "/gen-timeline",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    startTime: { type: "string" },
                    endTime: { type: "string" },
                    bookingId: { type: "string" },
                    maintenanceId: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    createGeneralizedRoomTimeline,
  );
  fastify.post("/image-upload/:roomId", uploadRoomImage);
  fastify.post("/upload", async (req, reply) => {
    const data = await req.file();
    await fileUploader(data);
    reply.send("done");
  });

  fastify.log.info("Room routes registered...");
}
