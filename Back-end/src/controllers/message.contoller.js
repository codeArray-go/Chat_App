import cloudinary from "../lib/cloudinary.js";
import { pool } from "../lib/db.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filtere = await pool.query(
      `SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.profile_pic 
      FROM users u
      LEFT JOIN messages m ON u.id = m.sender_id
      WHERE u.id !=$1
      ORDER BY m.created_at DESC;`,
      [loggedInUserId],
    );

    const filteredUsers = filtere.rows;

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in gettingAllContacts: ", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user.id;

    const { id: userToChatId } = req.params;

    const message = (
      await pool.query(
        `
          SELECT * FROM messages 
          WHERE 
          (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)
        `,
        [myId, userToChatId],
      )
    ).rows;

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

    if (!query) return;

    const searchQuery = (
      await pool.query(
        `SELECT id, email, full_name, profile_pic FROM users WHERE full_name ILIKE '%' || $1 || '%'`,
        [query],
      )
    ).rows;

    res.status(200).json(searchQuery);
  } catch (error) {
    console.log("Error in searching", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, reply_to } = req.body;
    const { id: receiver_id } = req.params;
    const sender_id = req.user.id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (sender_id === receiver_id) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await pool.query(`SELECT 1 FROM users WHERE id=$1`, [
      receiver_id,
    ]);
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadToCloudinary = await cloudinary.uploader.upload(image);
      imageUrl = uploadToCloudinary.secure_url;
    }

    const newMessage = (
      await pool.query(
        `INSERT INTO messages(sender_id, receiver_id, text, image, reply_to) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [sender_id, receiver_id, text, imageUrl, reply_to],
      )
    ).rows[0];

    const countUnreadCount = await pool.query(
      `SELECT COUNT(*) FROM messages WHERE (is_seen=false AND sender_id=$1 AND receiver_id=$2)`,
      [sender_id, receiver_id],
    );

    const unreadCount = Number(countUnreadCount.rows[0].count);

    const receiverSocketId = getReceiverSocketId(receiver_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("unreadCount", {
        sender: sender_id,
        count: unreadCount,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMesssage: ", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getNotification = async (req, res) => {
  try {
    const myId = req.user.id;

    if (!myId) return;

    const unreadMessages = (
      await pool.query(
        `
      SELECT sender_id, COUNT(*) AS unread_count FROM messages
      WHERE receiver_id=$1 AND is_seen=false
      GROUP BY sender_id
      `,
        [myId],
      )
    ).rows;

    res.status(201).json(unreadMessages);
  } catch (error) {
    console.log("Internal Server Error", error);
  }
};

export const getChatParameter = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // --------- Fetch user IDs that have chatted with the logged-in user ---------
    const chatPartenersId = (
      await pool.query(
        `SELECT DISTINCT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS partner_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1`,
        [loggedInUserId],
      )
    ).rows.map((row) => row.partner_id);

    if (chatPartenersId.length === 0) return res.json([]);

    const chatParteners = (
      await pool.query(
        `SELECT id, full_name, email, profile_pic FROM users WHERE id=ANY($1)`,
        [chatPartenersId],
      )
    ).rows;

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

    const Delete = (
      await pool.query(
        `DELETE FROM messages WHERE id=$1 AND sender_id=$2 RETURNING receiver_id`,
        [message_id, myId],
      )
    ).rows[0];

    const receiverSocketId = getReceiverSocketId(Delete.receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("DeletedMsgId", message_id);
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log(error);
  }
};
