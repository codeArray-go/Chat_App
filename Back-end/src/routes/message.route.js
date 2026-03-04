import express from "express";
import { arcjetProtection } from "../middileware/arcjet.middleware.js";
import { protectedRoute } from "../middileware/auth.middleware.js";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatParameter,
  getNotification,
  searchUser,
  deleteMessage,
} from "../controllers/message.contoller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);
// router.use(protectedRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatParameter);
router.get("/search", searchUser);
router.get("/getNoti", getNotification);
router.post("/delete", deleteMessage);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
