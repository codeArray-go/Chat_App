import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middileware/socket.auth.middleware.js";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL, ENV.CLIENT_URL_2],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// IF USER IS ONLINE OR NOT
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// STORE ONLINE USERS
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected.", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // LISTEN TO TYPING MESSAGE FROM CLIENT
  socket.on("typing", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId);
    }
  });

  // MESSAGE SEEN OR NOT
  socket.on(
    "markMessagesAsSeen",
    async ({ messageSenderId, myId, lastSeenMessageId }) => {
      const alreadySeen = await Message.exists({
        senderId: messageSenderId,
        receiverId: myId,
        _id: { $lte: lastSeenMessageId },
        isSeen: false,
      });

      if (!alreadySeen) return;
      try {
        if (!lastSeenMessageId) return;

        await Message.updateMany(
          {
            senderId: messageSenderId,
            receiverId: myId,
            _id: { $lte: lastSeenMessageId },
            isSeen: false,
          },
          { $set: { isSeen: true } },
        );

        const senderSocketId = getReceiverSocketId(messageSenderId);

        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesSeenByPeer", myId);
        }
      } catch (err) {
        console.error("Error updating seen messages:", err);
      }
    },
  );

  // STOP TYPING ANIMATION
  socket.on("stopTyping", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user got disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
