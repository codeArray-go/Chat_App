import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { pool } from "../lib/db.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - no token found." });

    const decode = jwt.verify(token, ENV.JWT_SECRET);
    if (!decode)
      return res.status(401).json({ message: "Unauthorized - Invalid Token." });

    const result = await pool.query(
      `SELECT id, email, full_name, profile_pic FROM users WHERE id=$1`,
      [decode.userId],
    );

    const user = result.rows[0];
    if (!user)
      return res
        .status(401)
        .json({ message: "Unauthorized - user not found." });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
