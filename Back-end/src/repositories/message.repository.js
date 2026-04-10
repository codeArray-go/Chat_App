import { pool } from "../lib/pool.js";

export const findAlreadySeenMessageRepo = async ({
  messagesender_id,
  myId,
}) => {
  const response = await pool.query(
    `SELECT * FROM messages WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=false`,
    [messagesender_id, myId],
  );

  return response.rows;
};

export const updateSeenStatusRepo = async ({ messagesender_id, myId }) => {
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
};

export const unreadeCountRepo = async ({ sender_id, receiver_id }) => {
  const response = await pool.query(
    `SELECT COUNT(*) FROM messages WHERE sender_id=$1 AND receiver_id=$2 AND is_seen=false`,
    [sender_id, receiver_id],
  );

  return response.rows[0].count;
};

export const getMessagesWithUserIdRepo = async ({ myId, userToChatId }) => {
  const response = await pool.query(
    `
          SELECT * FROM messages 
          WHERE 
          (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1) ORDER BY created_at ASC
        `,
    [myId, userToChatId],
  );

  return response.rows;
};

export const searchQueryRepo = async ({ query }) => {
  const response = await pool.query(
    `SELECT id, email, full_name, profile_pic FROM users WHERE full_name ILIKE '%' || $1 || '%'`,
    [query],
  );

  return response.rows;
};

export const checkReceiverExistanceRepo = async ({ receiver_id }) => {
  const response = await pool.query(`SELECT 1 FROM users WHERE id=$1`, [
    receiver_id,
  ]);
  return response.rows;
};

export const newMessageRepo = async ({
  sender_id,
  receiver_id,
  text,
  imageUrl,
  reply_to,
}) => {
  const response = await pool.query(
    `INSERT INTO messages(sender_id, receiver_id, text, image, reply_to) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [sender_id, receiver_id, text, imageUrl, reply_to],
  );

  return response.rows[0];
};

export const getNotificationRepo = async ({ myId }) => {
  const response = await pool.query(
    `
      SELECT sender_id, COUNT(*) AS unread_count FROM messages
      WHERE receiver_id=$1 AND is_seen=false
      GROUP BY sender_id
      `,
    [myId],
  );

  return response.rows;
};

export const getChatPartnersRepo = async ({ loggedInUserId }) => {
  const response = await pool.query(
    `SELECT DISTINCT ON (u.id)
        u.id,
        u.full_name,
        u.email,
        u.profile_pic,
        m.text,
        m.created_at,
        (m.sender_id = $1) AS is_me
      FROM users u
      JOIN messages m 
      ON (
        (m.sender_id = $1 AND m.receiver_id = u.id)
        OR 
        (m.sender_id = u.id AND m.receiver_id = $1)
      )
      WHERE u.id != $1
      ORDER BY u.id, m.created_at DESC;`,
    [loggedInUserId],
  );

  return response.rows;
};

export const deleteMessageRepo = async ({ message_id, myId }) => {
  const response = await pool.query(
    `DELETE FROM messages WHERE id=$1 AND sender_id=$2 RETURNING receiver_id`,
    [message_id, myId],
  );
  return response.rows[0];
};
