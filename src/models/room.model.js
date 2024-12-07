import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const roomSchema = new Schema(
  {
    roomNumber: {
      type: String,
      required: [true, requiredFieldMessage("roomNumber")],
    },
    roomTypeId: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: [true, requiredFieldMessage("Room Type")],
    },
    coverPhoto: {
      type: String,
      default: null,
    },
    isOccupied: {
      type: Boolean,
      required: [true, requiredFieldMessage("isOccupied")],
      default: false,
    },
    isUnderMaintenance: {
      type: Boolean,
      required: [true, requiredFieldMessage("isUnderMaintenance")],
      default: false,
    },
    currentGuestId: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
      default: null,
    },
    isDeleted: { type: Boolean },
  },
  { timestamps: true },
);

const Room = model("room", roomSchema);
export default Room;
