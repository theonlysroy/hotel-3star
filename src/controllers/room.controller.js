import Room from "../models/room.model.js";
import RoomType from "../models/roomType.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Booking from "../models/booking.model.js";
import fileUploader from "../utils/fileUpload.js";

/**
 * @function createRoom
 * @route POST /api/room/create
 * @description create a new room for the hotel
 * @param {Object} req : room details
 * @returns {201} if resource created successfully
 * @returns {400} if resource creation fails
 */
const createRoom = async (request, reply) => {
  const { roomNumber, roomType } = request.body;

  if ([roomNumber, roomType].some((field) => field?.toString() === undefined))
    throw new ApiError(400, "Room details are missing");

  const existingRoom = await Room.findOne({ roomNumber });
  if (existingRoom) throw new ApiError(401, "Room details already exists");

  const validRoomType = await RoomType.findById(roomType).select("-_id -__v");
  if (!validRoomType) throw new ApiError(404, "Invalid room type id given");

  const imageData = await request.file();
  let coverPhoto;
  if (imageData) {
    coverPhoto = await fileUploader(imageData);
  }
  const room = await Room.create({
    roomNumber,
    roomTypeId: roomType,
    coverPhoto,
  });

  const createdRoom = await Room.findById(room._id).select(
    "-_id -__v -createdAt -updatedAt",
  );
  if (!createdRoom) throw new Error();

  createdRoom.roomTypeId = validRoomType;
  return reply
    .status(201)
    .send(new ApiResponse(201, "Room created successfully", createdRoom));
};

/**
 * @function getAllRooms
 * @route GET /api/room/
 * @description list all available room
 * @returns {200} if resource fetched successfully
 * @returns {400} if resource fetching fails
 */
const getAllRooms = async (request, reply) => {
  const { isOccupied, isUnderMaintenance, isAirconditioned } = request.query;
  const filters = {};
  if (isOccupied !== undefined) {
    filters.isOccupied = isOccupied === "true";
  }
  if (isUnderMaintenance !== undefined) {
    filters.isUnderMaintenance = isUnderMaintenance === "true";
  }
  // if (isAirconditioned) {
  //   filters.isAirconditioned = isAirconditioned === "true";
  // }
  const roomFilters = {};
  roomFilters.isAirconditioned = isAirconditioned === "true";
  const rooms = await Room.aggregate([
    {
      $match: filters,
    },
    {
      $lookup: {
        from: "roomtypes",
        localField: "roomTypeId",
        foreignField: "_id",
        as: "roomTypeDetails",
      },
    },
    {
      $unwind: "$roomTypeDetails",
    },
  ]);
  if (!rooms) throw new Error();
  return reply
    .status(200)
    .send(new ApiResponse(200, "Room Types fetched successfully", rooms));
};

/**
 * @function getRoomId
 * @route GET /api/room/:id
 * @description list room details by id
 * @returns {200} if resource fetched successfully
 * @returns {400} if resource fetching fails
 */
const getRoomById = async (request, reply) => {
  const { roomId } = request.params;
  if (!roomId) throw new ApiError(400, "Request params is missing [roomId]");
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(400, "Invalid room id");

  reply
    .code(200)
    .send(new ApiResponse(200, "Resource fetched successfully", room));
};

/**
 * @function updateRoomById
 * @route PUT /api/room/:id
 * @description update room by id
 * @returns {200} if resource updated successfully
 * @returns {400} if resource updation fails
 */
const updateRoomById = async (request, reply) => {
  const { roomId } = request.params;
  if (!roomId)
    throw new ApiError(400, "Room id is required to udpate resource");
  const room = await Room.findById(roomId);
  if (!room)
    throw new ApiError(404, "Resource couldn't found;Invalid room id given");
  const { isOccupied, isUnderMaintenance, currentCustomer } = request.body;
  if (isOccupied && (currentCustomer === undefined || currentCustomer === ""))
    throw new ApiError(
      400,
      "Current customer can't be empty when isOccupied is true",
    );
  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    {
      $set: {
        isOccupied,
        isUnderMaintenance,
        currentCustomer,
      },
    },
    {
      new: true,
    },
  );
  if (!updatedRoom) throw new Error();
  return reply
    .status(200)
    .send(new ApiResponse(200, "Resource updated successfully", updatedRoom));
};

/**
 * @function uploadRoomImage
 * @route POST /api/v1/room/:id/image-upload
 */
const uploadRoomImage = async (request, reply) => {
  const { roomId } = request.params;
  const data = await request.file();
  if (!roomId) throw new ApiError(404, "Request params is missing [room id]");

  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(400, "Invalid room id");

  if (!data) throw new ApiError(404, "Request body is missing [image file]");
  const coverPhoto = await fileUploader(data);
  room.coverPhoto = coverPhoto;
  await room.save({ validateBeforeSave: false });
  reply
    .code(200)
    .send(new ApiResponse(200, "Room image uploaded successfully"));
};

/**
 * @function deleteRoomById
 * @route DELETE /api/room/:id
 * @description delete room by id
 * @returns {200} if resource deleted successfully
 * @returns {400} if resource deletion fails
 */
const deleteRoomById = async (request, reply) => {
  const { roomId } = request.params;
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Invalid room id");
  if (room.isOccupied) throw new ApiError(400, "Room is currently occupied");
  room.isDeleted = true;
  const deletedRoom = await room.save({ validateBeforeSave: false });
  // NOTE: console
  // console.log(deletedRoom);
  if (!deletedRoom) throw new Error();
  return reply
    .status(200)
    .send(new ApiResponse(200, "Resource deleted successfully", deletedRoom));
};

/**
 * @function vacateRoom
 * @route GET /api/v1/room/vacate
 */
const vacateRoom = async (request, reply) => {
  const roomsToVacate = await Room.aggregate([
    { $match: { isOccupied: true } },
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "roomId",
        as: "room_bookings",
      },
    },
    {
      $match: {
        "room_bookings.status": "Completed",
      },
    },
  ]);
  if (!roomsToVacate)
    throw new ApiError(404, "No occupied room found to vacate");
  roomsToVacate.map(async (room) => {
    room.isOccupied = false;
    await room.save({ validateBeforeSave: false });
  });
  reply
    .status(200)
    .send(
      new ApiResponse(
        200,
        "Occupied rooms vacated successfully",
        roomsToVacate,
      ),
    );
};

export {
  createRoom,
  getAllRooms,
  updateRoomById,
  uploadRoomImage,
  deleteRoomById,
  vacateRoom,
};
