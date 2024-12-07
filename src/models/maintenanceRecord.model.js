import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const maintenanceRecordSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: requiredFieldMessage("roomId"),
    },
    purpose: {
      type: String,
      required: requiredFieldMessage("purpose"),
      default: "cleaning",
    },
    startTime: {
      type: Date,
      required: requiredFieldMessage("startTime"),
    },
    endTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["in progress", "completed"],
      default: "in progress",
    },
  },
  { timestamps: true },
);

const MaintenanceRecord = model("maintenanceRecord", maintenanceRecordSchema);
export default MaintenanceRecord;
