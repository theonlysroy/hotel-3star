import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { messages } from "../utils/messages.js";

/**
 * @function createReviewForBooking
 * @route POST /api/:bookingId/review
 * @description create a review for the booking
 */
const createReviewForBooking = async (request, reply) => {
  const { bookingId } = request.params;
  const { rating, comment, suggestions } = request.body;
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview)
    throw new ApiError(400, "Booking is already reviewed. Try updating");

  const booking = await Booking.findById(bookingId);
  const review = await Review.create({
    bookingId,
    customerId: booking.customerId,
    rating,
    comment,
    suggestions: suggestions || "",
  });
  if (!review) throw new Error("Failed to create review");
  reply.status(201).send(new ApiResponse(201, messages.success.create, review));
};

/**
 * @function deleteReviewById
 * @route DELETE /review/:reviewId
 * @description delete (soft) a review by Id
 */
const deleteReviewById = async (request, reply) => {
  const { reviewId } = request.params;
  const review = await Review.findById(reviewId);

  if (!review || review.isDeleted) throw new ApiError(404, "Invalid review id");

  review.isDeleted = true;
  await review.save({ validateBeforeSave: false });
  reply.status(200).send(new ApiResponse(200, messages.success.delete, review));
};

/**
 * @function getAverageRating
 * @route GET /review/avg-rating
 * @description show the average rating of all the booking from the rating field of review
 */
const getAverageRating = async (request, reply) => {
  const { startDate, endDate } = request.query;
  const filters = {};
  if (startDate && endDate) {
    filters.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (startDate) {
    filters.createdAt = {
      $gte: new Date(startDate),
    };
  }

  //   console.log(filters);
  const averageRating = await Review.aggregate([
    {
      $match: filters,
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  reply.status(200).send(
    new ApiResponse(200, messages.success.fetch, {
      averageRating: averageRating[0]?.averageRating || "",
    }),
  );
};

export { createReviewForBooking, deleteReviewById, getAverageRating };
