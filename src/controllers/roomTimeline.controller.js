import ApiError from "../utils/ApiError.js";
import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";
import mongoose, { Types } from "mongoose";
import MaintenanceRecord from "../models/maintenanceRecord.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { messages } from "../utils/messages.js";

/**
 * @function createRoomTimeline
 * @route GET /room/timeline?roomId=
 * @description create a timeline for the rooms having the bookings and maintenance records
 */
const createRoomTimeline = async (request, reply) => {
  const { roomId } = request.query;
  if (!roomId) throw new ApiError(400, "Params must contain room id");
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Invalid room id; No room found");

  const dateWiseBookings = await Booking.aggregate([
    {
      $match: {
        roomId: new mongoose.Types.ObjectId(roomId),
      },
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$checkInTime",
          },
        },
        checkInTime: 1,
        checkOutTime: 1,
      },
    },
    {
      $group: {
        _id: "$date",
        bookings: {
          $push: "$$ROOT",
        },
      },
    },
  ]);

  const dateWiseMaintenances = await MaintenanceRecord.aggregate([
    {
      $match: {
        roomId: new Types.ObjectId(roomId),
      },
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$startTime",
          },
        },
        startTime: 1,
        endTime: 1,
        purpose: 1,
      },
    },
    {
      $group: {
        _id: "$date",
        maintenances: {
          $push: "$$ROOT",
        },
      },
    },
  ]);

  const roomTimeline = {};
  // creating maintenance map
  const maintenanceMap = dateWiseMaintenances.reduce((acc, record) => {
    acc[record._id] = record.maintenances;
    return acc;
  }, {});

  // merging bookings with the maintenance map based on the date
  if (dateWiseBookings && dateWiseBookings.length > 0) {
    for (const booking of dateWiseBookings) {
      const date = booking._id;
      roomTimeline[date] = {
        bookings: booking.bookings,
        maintenances: maintenanceMap[date] || [],
      };
    }
  }

  // insert all the maintenance records that are left
  // since the keys(date) don't have any booking record
  for (const date in maintenanceMap) {
    if (!roomTimeline.hasOwnProperty(date)) {
      roomTimeline[date] = {
        bookings: [],
        maintenances: maintenanceMap[date],
      };
    }
  }

  if (!roomTimeline) throw new ApiError(404, "Unable to fetch the timeline");

  reply.code(200).send(roomTimeline);
};

/**
 * @function createGeneralizedRoomTimeline
 * @route GET /room/gen-timeline?roomId=
 */
const createGeneralizedRoomTimeline = async (request, reply) => {
  const { roomId } = request.query;
  const generalRoomTimeline = await Booking.aggregate([
    {
      $match: {
        roomId: new mongoose.Types.ObjectId(roomId),
      },
    },
    {
      $project: {
        bookingId: "$_id",
        startTime: "$checkInTime",
        endTime: "$checkOutTime",
        _id: 0,
      },
    },
    {
      $unionWith: {
        coll: "maintenancerecords",
        pipeline: [
          {
            $match: {
              roomId: new mongoose.Types.ObjectId(roomId),
            },
          },
          {
            $project: {
              maintenanceId: "$_id",
              startTime: 1,
              endTime: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $sort: {
        startTime: 1,
      },
    },
  ]);

  if (!generalRoomTimeline) throw new ApiError(404, "Room Timeline not found");

  reply
    .code(200)
    .send(new ApiResponse(200, messages.success.fetch, generalRoomTimeline));
};

export { createRoomTimeline, createGeneralizedRoomTimeline };
