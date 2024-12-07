import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { messages } from "../utils/messages.js";
import MaintenanceRecord from "../models/maintenanceRecord.model.js";
import Room from "../models/room.model.js";

/**
 * @route POST /api/v1/maintenance-record
 * @description create a new maintenance record for a room
 */
const createMaintenanceRecord = async (request, reply) => {
  const { roomId, purpose } = request.body;
  if (!roomId) throw new ApiError(400, "Room id is missing");
  const room = await Room.findById(roomId);
  if (room.isOccupied)
    throw new ApiError(
      400,
      "Room is currently occupied. Can't start maintenance work",
    );
  const maintenanceRecord = await MaintenanceRecord.create({
    roomId,
    purpose,
    startTime: new Date().toISOString(),
  });
  if (!maintenanceRecord) throw new Error();
  room.isUnderMaintenance = true;
  await room.save({ validateBeforeSave: false });
  reply
    .status(201)
    .send(
      new ApiResponse(
        201,
        "Maintenance record created successfully",
        maintenanceRecord,
      ),
    );
};

/**
 * @route GET /api/v1/maintenance-record
 * @description fetch maintenance records for a room
 */
const getMaintenanceRecord = async (request, reply) => {
  const maintenanceRecords = await MaintenanceRecord.find();
  if (!maintenanceRecords) throw new Error();
  reply
    .status(200)
    .send(new ApiResponse(200, messages.success.fetch, maintenanceRecords));
};

/**
 * @route PUT /api/v1/maintenance-record/:id
 * @description update a maintenance record for a room by id
 */
const updateMaintenanceRecord = async (request, reply) => {
  const { maintenanceRecordId } = request.params;
  if (!maintenanceRecordId)
    throw new ApiError(400, "Maintenance Record id is missing");
  const updatedMaintenanceRecord = await MaintenanceRecord.findByIdAndUpdate(
    maintenanceRecordId,
    {
      $set: {
        status: "completed",
        endTime: new Date().toISOString(),
      },
    },
    {
      new: true,
    },
  );
  if (!updatedMaintenanceRecord) throw new Error();
  const updatedRoom = await Room.findByIdAndUpdate(
    updatedMaintenanceRecord.roomId,
    {
      $set: {
        isUnderMaintenance: false,
      },
    },
    {
      new: true,
    },
  );
  if (!updatedRoom) throw new Error();
  reply
    .status(202)
    .send(
      new ApiResponse(
        202,
        "Resource updated successfully",
        updatedMaintenanceRecord,
      ),
    );
};

/**
 * @route DELETE /api/v1/maintenance-record/:id
 * @description delete maintenance record for a room by id
 */
const deleteMaintenanceRecord = async (request, reply) => {};

export {
  createMaintenanceRecord,
  getMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
};
