import { pool } from "../lib/db.js";

export const createTables = async () => {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      password TEXT NOT NULL,
      profile_pic TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,

      sender_id BIGINT NOT NULL,
      receiver_id BIGINT NOT NULL,

      text TEXT,
      image TEXT DEFAULT NULL,
      is_seen BOOLEAN DEFAULT false,

      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,

      CHECK (text IS NOT NULL OR image IS NOT NULL)
    );
  `);
};
