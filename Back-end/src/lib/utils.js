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

  // FOR DEVELOPMENT :-
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });


  // FOR PRODUCTION:-
  // res.cookie("jwt", token, {
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  //   httpOnly: true, // prevent XSS attacks: cross-site scripting
  //   sameSite: "none",
  //   secure: true,
  //   path: "/",
  // });

  return token;
};

