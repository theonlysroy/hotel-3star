import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const reviewSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      required: requiredFieldMessage("bookingId"),
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: requiredFieldMessage("customerId"),
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: requiredFieldMessage("rating"),
    },
    comment: { type: String, default: null },
    suggestions: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Review = model("review", reviewSchema);
export default Review;
