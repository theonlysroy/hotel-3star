import { model, Schema } from "mongoose";
import { requiredFieldMessage } from "../utils/helpers.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, requiredFieldMessage("name")],
    },
    email: {
      type: String,
      required: [true, requiredFieldMessage("email")],
    },
    password: { type: String },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["manager", "customer", "driver", "staff"],
      default: "customer",
    },
    stripeCustomerId: { type: String, default: null },
    stripeSessionId: { type: String, default: null },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = model("user", userSchema);
export default User;
