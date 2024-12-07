import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const roomTypeSchema = new Schema({
  typeName: {
    type: String,
    required: [true, requiredFieldMessage("typeName")],
    unique: true,
  },
  bedroomCount: {
    type: Number,
    required: [true, requiredFieldMessage("bedroomCount")],
    default: 1,
  },
  isAirconditioned: { type: Boolean, default: false },
  hasTv: { type: Boolean, default: true },
  hasBathtub: { type: Boolean, default: false },
  hasBalcony: { type: Boolean, default: false },
  costPerDay: { type: Number, required: true },
});

const RoomType = model("roomType", roomTypeSchema);
export default RoomType;
