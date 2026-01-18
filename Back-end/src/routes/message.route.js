import express from "express";
import { arcjetProtection } from "../middileware/arcjet.middleware.js";
import { protectedRoute } from "../middileware/auth.middleware.js";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatParameter,
} from "../controllers/message.contoller.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatParameter);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
