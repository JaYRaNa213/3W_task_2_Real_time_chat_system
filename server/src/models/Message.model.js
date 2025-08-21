import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
    
      trim: true,
    },
    senderName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
