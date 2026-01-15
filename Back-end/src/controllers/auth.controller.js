import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ messsage: "All field are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ messsage: "Password should be atleat of 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message:
          "User already existing, try creating with different email address.",
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPass,
    });

    if (newUser) {
      // Persist User first and then issue auth cookie
      const savedUser = await newUser.save();
      genrateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilPic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Error sending email.");
      }
    } else {
      res.status(400).json({ message: "Invalid user credantial" });
    }
  } catch (error) {
    console.error("Error while signup: ", error);
    res.status(500).json({ message: "Internal server Error." });
  }
};
