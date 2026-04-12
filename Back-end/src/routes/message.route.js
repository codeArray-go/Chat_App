import express from "express";
import { arcjetProtection } from "../middileware/arcjet.middleware.js";
import { protectedRoute } from "../middileware/auth.middleware.js";
import {
  getMessagesByUserId,
  sendMessage,
  getNotification,
  searchUser,
  deleteMessage,
  getChatPartners,
} from "../controllers/message.contoller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.get("/chats", getChatPartners);
router.get("/search", searchUser);
router.get("/getNoti", getNotification);
router.post("/delete", deleteMessage);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
