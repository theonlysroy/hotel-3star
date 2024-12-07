import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    message: { type: String },
  },
  { timestamps: true },
);

const Chat = model("chat", chatSchema);
export default Chat;
