import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import {
  checkReceiverExistanceRepo,
  deleteMessageRepo,
  newMessageRepo,
  unreadeCountRepo,
} from "../repositories/message.repository.js";

export const sendMessageService = async (
  { text, image, reply_to },
  receiver_id,
  sender_id,
) => {
  const error = ValidatorForSendingMessage({
    text,
    image,
    sender_id,
    receiver_id,
  });
  if (error) throw new Error(error);

  const receiverExists = await checkReceiverExistanceRepo({ receiver_id });
  if (receiverExists.length === 0) {
    return "Receiver not found.";
  }

  let imageUrl;
  if (image && image.trim() !== "") {
    const uploadToCloudinary = await cloudinary.uploader.upload(image);
    imageUrl = uploadToCloudinary.secure_url;
  }

  const newMessage = await newMessageRepo({
    sender_id,
    receiver_id,
    text,
    imageUrl,
    reply_to,
  });

  const unreadCount = await unreadeCountRepo({ sender_id, receiver_id });

  const receiverSocketId = getReceiverSocketId(receiver_id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
    io.to(receiverSocketId).emit("unreadCount", {
      sender: sender_id,
      count: unreadCount,
    });
  }

  return newMessage;
};

export const deleteMessageService = async ({ message_id, myId }) => {
  const Delete = deleteMessageRepo({ message_id, myId });

  const receiverSocketId = getReceiverSocketId(Delete.receiver_id);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("DeletedMsgId", message_id);
  }
};
