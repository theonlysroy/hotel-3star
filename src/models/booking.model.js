import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const bookingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: requiredFieldMessage("Customer id"),
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: requiredFieldMessage("Room"),
    },
    checkInTime: {
      type: Date,
      required: requiredFieldMessage("Check-In time"),
    },
    checkOutTime: {
      type: Date,
      required: requiredFieldMessage("Check-Out time"),
    },
    status: {
      type: String,
      enum: ["Booked", "Ongoing", "Completed"],
      default: "Booked",
    },
    cost: { type: Number },
  },
  { timestamps: true }
);

const Booking = model("booking", bookingSchema);
export default Booking;
