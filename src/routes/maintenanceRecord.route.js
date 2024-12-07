import {
  createMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecord,
  updateMaintenanceRecord,
} from "../controllers/maintenanceRecord.controller.js";

export async function maintenanceRecordRoutes(fastify) {
  fastify.post(
    "/",
    { onRequest: [fastify.auth, fastify.managerAuth] },
    createMaintenanceRecord,
  );

  fastify.get(
    "/",
    { onRequest: [fastify.auth, fastify.managerAuth] },
    getMaintenanceRecord,
  );

  fastify.put(
    "/:maintenanceRecordId",
    { onRequest: [fastify.auth, fastify.managerAuth] },
    updateMaintenanceRecord,
  );

  fastify.delete(
    "/:mrId",
    { onRequest: [fastify.auth, fastify.managerAuth] },
    deleteMaintenanceRecord,
  );
}
