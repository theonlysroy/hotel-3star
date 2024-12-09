import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import RoomType from "../models/roomType.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { messages } from "../utils/messages.js";
import { createCheckoutSession, createPaymentIntent } from "../utils/stripe.js";
import createCSVFromJSONData from "../utils/jsonToCSV.js";
import path from "node:path";
import { readFile } from "node:fs";
import { BASE_URL } from "../../constants.js";
import mongoose from "mongoose";

// create booking
/**
 * @route POST /booking
 * @description create a new booking
 */
const createBooking = (stripe) => async (request, reply) => {
  const { name, email, phoneNumber, address, roomId } = request.body;
  // check if room is currently empty or not under maintenance
  const room = await Room.findById(roomId);
  if (room.isOccupied)
    throw new ApiError(400, "Room is currently booked! No bookings.");
  if (room.isUnderMaintenance)
    throw new ApiError(
      400,
      "Room is currently under maintenance! No bookings.",
    );
  const customer = await User.findOne({ email });
  let customerId = customer?._id;
  if (!customer && (name === "" || name === undefined))
    throw new ApiError(
      404,
      "Customer doesn't exists. Give name, phone number and address to create customer",
    );
  let url = "";
  if (!customer) {
    const createdCustomer = await User.create({
      name,
      email,
      phoneNumber,
      address,
      role: "customer",
    });
    if (!createdCustomer) throw new Error();
    customerId = createdCustomer._id;
    const { stripeCustomerId, stripeSessionId, saveCardUrl } =
      await createCheckoutSession(stripe, { name, email });

    await User.findByIdAndUpdate(customerId, {
      $set: {
        stripeCustomerId,
        stripeSessionId,
      },
    });
    url = saveCardUrl;
  }
  const currTime = new Date();
  //   const timeAfter1Day = currTime.getTime() + 24 * 60 * 60 * 1000;
  const checkInTime = currTime.toLocaleString();
  //   const checkOutTime = new Date(timeAfter1Day).toLocaleString();
  const booking = await Booking.create({
    customerId,
    roomId,
    checkInTime,
  });
  if (!booking) throw new ApiError(500, "Failed to create a new booking");
  room.isOccupied = true;
  room.currentGuestId = customerId;
  await room.save({ validateBeforeSave: false });

  reply.status(201).send(
    new ApiResponse(201, messages.success.create, {
      url,
    }),
  );
};

// get bookings
const getAllBookings = async (request, reply) => {
  const q = request.query;
  const allBookings = await Booking.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "customerId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "room",
      },
    },
    {
      $addFields: {
        roomNumber: "$room.roomNumber",
        customerName: "$user.name",
      },
    },
    {
      $unwind: "$roomNumber",
    },
    {
      $unwind: "$customerName",
    },
    {
      $project: {
        customerName: 1,
        roomNumber: 1,
        checkInTime: 1,
        checkOutTime: 1,
        status: 1,
        cost: 1,
      },
    },
  ]);

  if (!allBookings) throw new ApiError(404, messages.failure.notFound);
  reply
    .status(200)
    .send(new ApiResponse(200, messages.success.fetch, allBookings));
};

// update booking by id
const updateBookingById = async (request, reply) => {
  const { bookingId } = request.params;
  if (!bookingId) throw new ApiError(400, "Booking id is missing");
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "No booking found! Invalid booking id");
  const room = await Room.findById(booking.roomId);
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: "Completed",
        checkOutTime: new Date().toISOString(),
      },
    },
    {
      new: true,
    },
  );
  if (!updatedBooking) throw new Error();
  room.isOccupied = false;
  room.currentGuestId = "";
  await room.save({ validateBeforeSave: false });
  reply
    .code(200)
    .send(new ApiResponse(200, messages.success.update, updatedBooking));
};

// delete booking by id
const deleteBookingById = async (request, reply) => {};

// complete booking by id
const vacateBookingById = (stripe) => async (request, reply) => {
  const { bookingId } = request.params;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "No booking found! Invalid booking id");
  if (booking.status === "Completed")
    throw new ApiError(404, "Booking is already vacated");

  const user = await User.findById(booking.customerId);

  const room = await Room.findById(booking.roomId);
  const roomType = await RoomType.findById(room?.roomTypeId).select(
    "costPerDay",
  );

  const timeDiff = Math.abs(new Date() - new Date(booking.checkInTime));
  const duration = Math.floor(timeDiff / (1000 * 60 * 60));
  let amountToPay = parseInt(roomType.costPerDay);
  if (duration > 24) {
    amountToPay = costPerDay * Math.floor(duration / 24);
  }

  const paymentIntentDetails = await createPaymentIntent(stripe, {
    stripeSessionId: user?.stripeSessionId,
    amount: amountToPay * 100,
  });
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: "Completed",
        checkOutTime: new Date().toISOString(),
        cost: amountToPay,
      },
    },
    {
      new: true,
    },
  );
  if (!updatedBooking) throw new Error();
  room.isOccupied = false;
  room.currentGuestId = null;
  await room.save({ validateBeforeSave: false });

  reply.code(200).send(
    new ApiResponse(200, messages.success.update, {
      paymentIntentDetails,
    }),
  );
};

// download bookings data as csv
const downloadBookingsData = async (request, reply) => {
  const allBookings = await Booking.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "customerId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "roomId",
        foreignField: "_id",
        as: "room",
      },
    },
    {
      $addFields: {
        roomNumber: "$room.roomNumber",
        customerName: "$user.name",
      },
    },
    {
      $unwind: "$roomNumber",
    },
    {
      $unwind: "$customerName",
    },
    {
      $project: {
        customerName: 1,
        roomNumber: 1,
        checkInTime: 1,
        checkOutTime: 1,
        status: 1,
        cost: 1,
      },
    },
  ]);

  await createCSVFromJSONData("Bookings", allBookings, "bookings");
  const fileName = path.join(BASE_URL, "csv", "bookings.csv");
  readFile(fileName, (err, buffer) => {
    reply.send(err || buffer);
  });
  return reply;
};

/**
 * @function downloadBookingsDataAsPDF
 * @route GET /api/v1/booking/generate-pdf
 */
const downloadBookingsDataAsPDF = async (request, reply) => {
  // load the html (ejs) template
  // add dynamic data to it
  // create PDF document (puppeteer / pdfkit)
  // add the content to the document
  // save the pdf
  // send the pdf as streams
};

/**
 * @function createPreBooking
 * @route POST /api/v1/booking/pre
 * @requires Object {check in date, check out date, name, email, phone number, address}
 * @returns 201 if success
 * @returns 500 if error
 */
const createPreBooking = async (request, reply) => {
  // get request body data (date, roomNumber, name, email, phone number, address)
  const {
    checkInDate,
    checkOutDate,
    roomId,
    name,
    email,
    phoneNumber,
    address,
  } = request.body;
  if (
    [checkInDate, checkOutDate, name, email, phoneNumber, address].some(
      (field) => field?.trim() === undefined || field?.trim() === "",
    )
  )
    throw new ApiError(
      404,
      "Request body is missing [checkInDate, checkOutDate, name, email, phoneNumber, address]",
    );
  // find the room number availability
  const room = await Room.findById(roomId);
  if (!room) throw new ApiError(404, "Invalid room id");

  if (room?.occupiedDates?.includes(checkInDate))
    throw new ApiError(400, "Room is already booked for the requested date");

  // update the occupied dates of room
  room.occupiedDates.push(checkInDate);
  await room.save({ validateBeforeSave: false });

  // create a booking  (isPreBooking: true)
  const booking = await Booking.create();
  // create stripe checkout session (mode: "payment")
  //    -> account
  //    -> save card details after payment
  // send success / failure response
};

export {
  createBooking,
  getAllBookings,
  updateBookingById,
  deleteBookingById,
  vacateBookingById,
  downloadBookingsData,
  downloadBookingsDataAsPDF,
  createPreBooking,
};
