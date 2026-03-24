import { genrateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { pool } from "../lib/db.js";

export const signup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    if (!full_name || !email || !password) {
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

    const user = (
      await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    ).rows;

    if (user.length > 0) {
      return res.status(400).json({
        message:
          "User already existing, try creating with different email address.",
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users(full_name, email, password) VALUES($1, $2, $3) RETURNING id, full_name, email, profile_pic`,
      [full_name, email, hashedPass],
    );

    const result = newUser.rows[0];

    if (result) {
      const token = genrateToken(result.id, res);

      res.status(201).json({
        token,
        id: result.id,
        full_name: result.full_name,
        email: result.email,
        profile_pic: result.profile_pic,
      });
    } else {
      res.status(400).json({ message: "Invalid user credantial" });
    }
  } catch (error) {
    console.error("Error while signup: ", error);
    res.status(500).json({ message: "Internal server Error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credential." });
  }

  try {
    const check = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    const user = check.rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.status(400).json({ message: "Invalid credentials." });

    const token = genrateToken(user.id, res);

    res.status(200).json({
      token,
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      profile_pic: user.profile_pic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Your are successfully logged out." });
};

export const updateProfile = async (req, res) => {
  try {
    const { profile_pic } = req.body;
    if (!profile_pic)
      return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user.id;

    const uploadResponse = await cloudinary.uploader.upload(profile_pic);

    const update = await pool.query(
      `UPDATE users SET profile_pic=$1 WHERE id=$2`,
      [uploadResponse.secure_url, userId],
    );

    res.status(200).json({ message: "Successfully updated message." });
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
