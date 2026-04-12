import {
  getChatPartnersRepo,
  getMessagesWithUserIdRepo,
  getNotificationRepo,
  searchQueryRepo,
} from "../repositories/message.repository.js";
import {
  deleteMessageService,
  sendMessageService,
} from "../service/message.service.js";
import { ValidatorforSearchQuery } from "../utils/validator.js";

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: userToChatId } = req.params;

    const message = await getMessagesWithUserIdRepo({ myId, userToChatId });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getmessageController: ", error.message);
    res.status(500).json({ message: "Internal srever error." });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);

    const error = ValidatorforSearchQuery({ query });
    if (error)
      return res.status(404).json({ message: "no search query entered." });

    const searchQuery = searchQueryRepo({ query });

    res.status(200).json(searchQuery);
  } catch (error) {
    console.log("Error in searching", error);
    res.status(500).json({ error: "Internal server error.", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiver_id } = req.params;
    const sender_id = req.user.id;

    const newMessage = await sendMessageService(
      req.body,
      receiver_id,
      sender_id,
    );

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMesssage: ", error.message);
    res.status(500).json({ error: "Internal server error.", error });
  }
};

export const getNotification = async (req, res) => {
  try {
    const myId = req.user.id;

    const unreadMessages = await getNotificationRepo({ myId });

    res.status(201).json(unreadMessages);
  } catch (error) {
    console.log("Internal Server Error", error);
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const chatParteners = await getChatPartnersRepo({ loggedInUserId });

    res.status(200).json(chatParteners);
  } catch (error) {
    console.error("getChatparameter error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteMessage = async (req, res) => {
  const { message_id } = req.body;
  const myId = req.user.id;

  try {
    if (!message_id) return;

    await deleteMessageService({message_id, myId});

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log(error);
  }
};
