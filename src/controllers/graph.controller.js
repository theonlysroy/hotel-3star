import Booking from "../models/booking.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { messages } from "../utils/messages.js";
import { createClient } from "redis";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/**
 * @function getEarningsGraphData
 * @route GET /api/v1/earnings-graph
 * @description fetch the graph data for time v/s earning
 */
const getEarningsGraphData = async (request, reply) => {
  //   const client = await createClient()
  //     .on("error", (err) => console.log("Redis Client Error", err))
  //     .connect();
  //   const redisData = await client.get("earnings");
  //   if (redisData) return reply.status(200).send(JSON.parse(redisData));
  const earningsGraphData = await Booking.aggregate([
    {
      $group: {
        _id: { $month: "$checkOutTime" },
        totalEarnings: {
          $sum: "$cost",
        },
      },
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id"],
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  const x_axis = [];
  const y_axis = [];

  const earningMap = {};
  earningsGraphData.map(({ totalEarnings, month }) => {
    earningMap[month] = totalEarnings;
  });

  months.map((month) => {
    x_axis.push(month);
    y_axis.push(earningMap[month] || 0);
  });

  //   await client.set("earnings", JSON.stringify({ x_axis, y_axis }));

  reply.status(200).send({ x_axis, y_axis });
};

/**
 * @function getBookingsCreationGraphData
 * @route GET /api/v1/bookings-creation-graph
 * @description fetch the graph data from time v/s booking creation
 */
const getBookingsCreationGraphData = async (request, reply) => {
  const creationGraphData = await Booking.aggregate([
    {
      $group: {
        _id: { $month: "$checkInTime" },
        totalBookings: { $sum: 1 },
      },
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id"],
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const x_axis = [];
  const y_axis = [];
  const creationMap = {};
  creationGraphData.map(({ totalBookings, month }) => {
    creationMap[month] = totalBookings;
  });
  months.map((month) => {
    x_axis.push(month);
    y_axis.push(creationMap[month] || 0);
  });
  reply.code(200).send({ x_axis, y_axis });
};

/**
 * @function getBookingsVacationGraphData
 * @route GET /api/v1/bookings-vacation-graph
 * @description fetch the graph data from time v/s booking vacation
 */
const getBookingsVacationGraphData = async (request, reply) => {
  const vacationGraphData = await Booking.aggregate([
    {
      $group: {
        _id: { $month: "$checkOutTime" },
        totalBookingVacations: { $sum: 1 },
      },
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: ["$$monthsInString", "$_id"],
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const x_axis = [];
  const y_axis = [];
  const vacationMap = {};
  vacationGraphData.map(({ totalBookingVacations, month }) => {
    vacationMap[month] = totalBookingVacations;
  });
  months.map((month) => {
    x_axis.push(month);
    y_axis.push(vacationMap[month] || 0);
  });
  reply.code(200).send({ x_axis, y_axis });
};

export {
  getEarningsGraphData,
  getBookingsCreationGraphData,
  getBookingsVacationGraphData,
};
