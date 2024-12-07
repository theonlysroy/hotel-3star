import {
  createRoomType,
  deleteRoomTypeById,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomTypeById,
} from "../controllers/roomType.controller.js";
import {
  createRoomTypeSerialization,
  deleteRoomTypeSerialization,
  getRoomTypeByIdSerialization,
  getRoomTypeSerialization,
  updateRoomTypeSerialization,
} from "../serializatons/roomType.serialization.js";

export async function roomTypeRoutes(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        response: getRoomTypeSerialization,
      },
    },
    getAllRoomTypes,
  );
  fastify.get(
    "/:roomTypeId",
    { schema: { response: getRoomTypeByIdSerialization } },
    getRoomTypeById,
  );
  fastify.post(
    "/",
    { schema: { response: createRoomTypeSerialization } },
    createRoomType,
  );
  fastify.put(
    "/:roomTypeId",
    { schema: { response: updateRoomTypeSerialization } },
    updateRoomTypeById,
  );
  fastify.delete(
    "/:roomTypeId",
    { schema: { response: deleteRoomTypeSerialization } },
    deleteRoomTypeById,
  );

  fastify.log.info("Room type routes registered...");
}
