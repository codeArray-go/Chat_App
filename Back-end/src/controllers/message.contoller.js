import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in gettingAllContacts: ", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;

    const { id: userToChatId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getmessageController: ", error.message);
    res.status(500).json({ message: "Internal srever error." });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) return;

    const searchQuery = await User.find({ fullName: { $regex: query } })

    res.status(200).json(searchQuery);
  } catch (error) {
    console.log("Error in searching", error)
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadToCloudinary = await cloudinary.uploader.upload(image);
      imageUrl = uploadToCloudinary.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isSeen: false,
    });

    await newMessage.save();

    // SENDING MESAAGES IN REAL-TIME IF USER IF ONLINE- SOCKET.IO
    const unreadCount = await Message.countDocuments({
      senderId: senderId,
      receiverId: receiverId,
      isSeen: false,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("unreadCount", {
        sender: senderId,
        count: unreadCount,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMesssage: ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET NOTIFICATION FROM DATABASE
export const getNotification = async (req, res) => {
  try {
    const myId = req.user._id;

    if (!myId) return;

    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiverId: myId,
          isSeen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }, // count per sender
        },
      },
    ]);

    res.status(201).json(unreadMessages);
  } catch (error) {
    console.log("Internal Server Error", error);
  }
};

export const getChatParameter = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // FIND ALL THE MESSAGE WHERE THE LOGGED-IN USER IS EITHER A RECIEVER OR A SENDER.
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartenersId = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatParteners = await User.find({
      _id: { $in: chatPartenersId },
    }).select("-password");

    res.status(200).json(chatParteners);
  } catch (error) {
    console.log("Error in getChatparameter: ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
