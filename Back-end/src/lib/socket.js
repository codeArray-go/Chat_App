import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middileware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL, ENV.CLIENT_URL_2],
    credentials: true,
  },
});

// Apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// Function to check if user is online or not
export function getRecieverSocketid(userId) {
  return userSocketMap[userId];
}

// Thisis for storing online users
const userSocketMap = {}; // {userId: SocketId}

io.on("connection", (socket) => {
  console.log("A user connected.", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for "typing" event from client
  socket.on("typing", (receiverId) => {
    const receiverSocketId = getRecieverSocketid(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", socket.userId);
    }
  });

  // It will handle typing stop
  socket.on("stopTyping", (receiverId) => {
    const receiverSocketId = getRecieverSocketid(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", socket.userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user got disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
