import Room from "../models/room.model.js";
import RoomType from "../models/roomType.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @function createRoomType
 * @route POST /api/room-type/create
 * @description create a new room type for the hotel
 * @param {Object} req : room type details
 * @returns {201} if resource created successfully
 * @returns {400} if resource creation fails
 */
const createRoomType = async (request, reply) => {
  const {
    typeName,
    isAirconditioned,
    bedroomCount,
    hasTv,
    hasBathtub,
    hasBalcony,
    costPerDay,
  } = request.body;

  if (
    [
      typeName,
      isAirconditioned,
      bedroomCount,
      hasBalcony,
      hasTv,
      hasBathtub,
    ].some((field) => field?.toString() === undefined) ||
    isNaN(costPerDay)
  )
    throw new ApiError(400, "Room type details are missing");

  const existingRoomType = await RoomType.findOne({ typeName });
  if (existingRoomType)
    throw new ApiError(401, "Room type with exact details already exists");

  const roomType = await RoomType.create({
    typeName,
    isAirconditioned,
    bedroomCount,
    hasTv,
    hasBathtub,
    hasBalcony,
    costPerDay,
  });

  if (!roomType) throw new Error();

  return reply
    .status(201)
    .send(new ApiResponse(201, "Room type created successfully", roomType));
};

/**
 * @function getAllRoomTypes
 * @route GET /api/room-type/
 * @description list all available room types
 * @returns {201} if resource fetched successfully
 * @returns {400} if resource fetching fails
 */
const getAllRoomTypes = async (request, reply) => {
  const roomTypes = await RoomType.find().select("-__v");

  if (!roomTypes) throw new Error();
  return reply
    .status(200)
    .send(new ApiResponse(200, "Room Types fetched successfully", roomTypes));
};

/**
 * @function getRoomTypeById
 * @route GET /api/room-type/:id
 */
const getRoomTypeById = async (request, reply) => {
  const { roomTypeId } = request.params;
  if (!roomTypeId) throw new ApiError(400, "Room type id is required");

  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new ApiError(404, "Invalid room type id");

  reply
    .code(200)
    .send(new ApiResponse(200, "Resource fetched successfully", roomType));
};

/**
 * @function updateRoomTypeById
 * @route PUT /api/room-type/:id
 * @description update room type by id
 * @returns {200} if resource updated successfully
 * @returns {400} if resource updation fails
 */
const updateRoomTypeById = async (request, reply, next) => {
  const { roomTypeId } = request.params;
  if (!roomTypeId) throw new ApiError(400, "Room type id is required");
  const body = request.body;
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new ApiError(404, "Invalid room type id");

  // NOTE: console
  //   console.log(body);
  for (const key in body) {
    if (body[key]) roomType[key] = body[key];
  }
  // NOTE:
  //   console.log(roomType);
  await roomType.save({ validateBeforeSave: false });
  reply
    .status(200)
    .send(new ApiResponse(200, "Resource updated successfully", roomType));
};

/**
 * @function deleteRoomTypeById
 * @route DELETE /api/room-type/:id
 * @description delete room type by id
 * @returns {200} if resource deleted successfully
 * @returns {400} if resource deletion fails
 */
const deleteRoomTypeById = async (request, reply, next) => {
  const { roomTypeId } = request.params;
  if (!roomTypeId) throw new ApiError(400, "Room type id is required");
  const roomType = await RoomType.findById(roomTypeId);
  if (!roomType) throw new ApiError(404, "Invalid room type id");
  const roomsUsingCurrentRoomType = await Room.aggregate([
    {
      $match: {
        roomType: roomTypeId,
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);
  //   NOTE:
  console.log(roomsUsingCurrentRoomType);
  if (roomsUsingCurrentRoomType)
    throw new ApiError(
      400,
      "Some rooms are using the current room type",
      roomsUsingCurrentRoomType,
    );
  const deletedRoomType = await RoomType.findByIdAndDelete(roomTypeId);
  if (!deleteRoomTypeById) throw new Error();
  return reply
    .status(200)
    .send(
      new ApiResponse(200, "Resource deleted successfully", deletedRoomType),
    );
};

export {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomTypeById,
  deleteRoomTypeById,
};
