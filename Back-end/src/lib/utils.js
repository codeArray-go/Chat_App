import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const genrateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //this is in millisecond
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", //CSRF attacks
    secure: true, // for production purpose
    path: "/",
  });

  return token;
};
