import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { pool } from "../lib/pool.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    let token;
    // Token from flutter
    if (socket.handshake.headers.authorization?.startsWith("Bearer ")) {
      token = socket.handshake.headers.authorization.split(" ")[1];
    }

    // extract token from http-only cookies
    if (socket.handshake.headers.cookie) {
      token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];
    }

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user fromdb
    const user = (
      await pool.query(
        `SELECT id, email, full_name, profile_pic FROM users WHERE id=$1`,
        [decoded.userId],
      )
    ).rows[0];

    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user.id;

    console.log(
      `Socket authenticated for user: ${user.full_name} with id: (${user.id})`,
    );

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
