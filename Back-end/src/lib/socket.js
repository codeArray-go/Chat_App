import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middileware/socket.auth.middleware.js";
import { pool } from "./db.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL, ENV.CLIENT_URL_2],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// ------ STORE ONLINE USERS ------
const userSocketMap = {};

// ------ IF USER IS ONLINE OR NOT ------
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected.", socket.user.full_name);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //------ LISTEN TO TYPING MESSAGE FROM CLIENT ------
  socket.on("typing", (receiver_id) => {
    const receiverSocketId = getReceiverSocketId(receiver_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId);
    }
  });

  //------ MESSAGE SEEN OR NOT ------
  socket.on("markMessagesAsSeen", async ({ messagesender_id, myId }) => {
    const alreadySeen = (
      await pool.query(
        `SELECT * FROM messages WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=false`,
        [messagesender_id, myId],
      )
    ).rows;

    if (alreadySeen.length === 0) return;

    try {
      await pool.query(
        `
        UPDATE messages 
        SET 
          sender_id=$1, receiver_id=$2, is_seen=true 
        WHERE 
          sender_id=$1 AND receiver_id=$2 AND is_seen=false
        `,
        [messagesender_id, myId],
      );

      const senderSocketId = getReceiverSocketId(messagesender_id);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeenByPeer", myId);
      }

      const unreadCount = (
        await pool.query(
          `SELECT COUNT(*) FROM messages WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=false`,
          [messagesender_id, myId],
        )
      ).rows[0].count;

      if (unreadCount > 0) return;

      const mySocketId = getReceiverSocketId(myId);
      io.to(mySocketId).emit("unreadCountUpdateAfterSeen", {
        sender: messagesender_id,
        count: unreadCount,
      });
    } catch (err) {
      console.error("Error updating seen messages:", err);
    }
  });

  //------ STOP TYPING ANIMATION ------
  socket.on("stopTyping", (receiver_id) => {
    const receiverSocketId = getReceiverSocketId(receiver_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user got disconnected", socket.user.full_name);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
