import mongoose from "mongoose";

const requestScheme = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  request: {
    type: Boolean,
    default: true,
  }
})

const Request = mongoose.model("Request", requestScheme);
export default Request;
