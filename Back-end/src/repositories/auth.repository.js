import { pool } from "../lib/pool.js";

export const extingEmailCheckRepo = async (email) => {
  const response = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  return response.rows[0];
};

export const createNewUserRepo = async ({ full_name, email, hashedPass }) => {
  const response = await pool.query(
    `INSERT INTO 
        users(full_name, email, password) 
        VALUES($1, $2, $3) 
    RETURNING id, full_name, email, profile_pic`,
    [full_name, email, hashedPass],
  );

  return response.rows[0];
};

export const updateProfilePicRepo = async ({ url, userId }) => {
  const response = await pool.query(
    `UPDATE users SET profile_pic=$1 WHERE id=$2 RETURNING profile_pic`,
    [url, userId],
  );
  return response.rows;
};

export const updateProfileNameRepo = async ({newName, id}) => {
  const res = await pool.query(`
    UPDATE users SET full_name=$1 WHERE id=$2 RETURNING full_name;
  `, [newName, id]);

  return res.rows;
}
